import { NextResponse } from "next/server";
import prisma from "@/lib/db.config";
import { stripe } from "@/lib/stripe.config";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { InvoiceStatus } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("❌ Webhook Signature Verification Failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.warn(` Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle Checkout Session Completed
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (!session?.metadata?.userId || !session.subscription) {
    console.error("Missing userId or subscription ID in Checkout Session.");
    return;
  }

  await prisma.user.update({
    where: { id: session.metadata.userId },
    data: { stripeCustomerId: session.customer as string },
  });
}

// Handle Subscription Create/Update
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error(` No user found for customerId: ${subscription.customer}`);
    return;
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      planName: subscription.items.data[0].price.nickname || "Pro",
      id: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status === "active" ? "ACTIVE" : "CANCELED",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
    create: {
      userId: user.id,
      planName: subscription.items.data[0].price.nickname || "Pro",
      id: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status === "active" ? "ACTIVE" : "CANCELED",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  });
}

// Handle Subscription Deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error(`No user found for deleted subscription: ${subscription.id}`);
    return;
  }

  await prisma.subscription.deleteMany({ where: { userId: user.id } });
}

// Handle Invoice Payment Success
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  attempts = 0
) {
  const MAX_RETRIES = 3;

  const subscription = await prisma.subscription.findFirst({
    where: { id: invoice.subscription as string },
  });

  if (!subscription) {
    if (attempts >= MAX_RETRIES) {
      console.error(`Max retries reached for invoice: ${invoice.id}`);
      return;
    }

    console.warn(
      `No subscription found immediately for invoice: ${invoice.id}. Retrying in 3 seconds...`
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await handleInvoicePaymentSucceeded(invoice, attempts + 1);
  }

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amountPaid: invoice.amount_paid / 100,
      amountDue: invoice.amount_due / 100,
      amountRemaining: invoice.amount_remaining / 100,
      currency: invoice.currency,
      status: (invoice.status?.toUpperCase() as InvoiceStatus) ?? "PAID",
      invoiceUrl: invoice.hosted_invoice_url ?? "",
    },
  });
}

// Handle Invoice Payment Failure
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: invoice.subscription as string },
  });

  if (!subscription) {
    console.error(`No subscription found for invoice: ${invoice.id}`);
    return;
  }

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amountPaid: invoice.amount_paid / 100,
      amountDue: invoice.amount_due / 100,
      amountRemaining: invoice.amount_remaining / 100,
      currency: invoice.currency,
      status: (invoice.status?.toUpperCase() as InvoiceStatus) ?? "OPEN",
      invoiceUrl: invoice.hosted_invoice_url ?? "",
    },
  });
}
