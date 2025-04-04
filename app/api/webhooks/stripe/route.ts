import { NextResponse } from "next/server";
import prisma from "@/lib/db.config";
import { stripe } from "@/lib/stripe.config";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { InvoiceStatus, SubscriptionStatus } from "@prisma/client";

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
      case "customer.subscription.deleted":
        await handleSubscription(
          event.data.object as Stripe.Subscription,
          event.type.split(".")[2]
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoice(event.data.object as Stripe.Invoice, "succeeded");
        break;

      case "invoice.payment_failed":
        await handleInvoice(event.data.object as Stripe.Invoice, "failed");
        break;

      default:
        console.warn(`⚠️ Unhandled event type: ${event.type}`);
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
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !customerId || !subscriptionId) {
    console.error("❌ Missing data in Checkout Session");
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  });

  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
  if (stripeSub) {
    await handleSubscription(stripeSub, "created");
  } else {
    console.error("❌ Subscription not found immediately after checkout.");
  }
}

// Handle Subscription Create/Update/Delete
async function handleSubscription(
  subscription: Stripe.Subscription,
  eventType: string,
  attempts = 0
) {
  const MAX_RETRIES = 3;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    if (attempts >= MAX_RETRIES) {
      console.error(
        `❌ User not found after ${MAX_RETRIES} attempts for customerId: ${subscription.customer}`
      );
      return;
    }

    console.warn(`⏳ User not found. Retrying (${attempts + 1})...`);
    await delay(3000);
    return await handleSubscription(subscription, eventType, attempts + 1);
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      id: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      planName: subscription.items.data[0].price.nickname || "Pro",
      status: subscription.status?.toUpperCase() as SubscriptionStatus,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
    create: {
      userId: user.id,
      id: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      planName: subscription.items.data[0].price.nickname || "Pro",
      status: subscription.status?.toUpperCase() as SubscriptionStatus,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  });
}

// Handle Invoice (Success & Failure)
async function handleInvoice(
  invoice: Stripe.Invoice,
  eventType: "succeeded" | "failed",
  attempts = 0
) {
  const MAX_RETRIES = 3;

  const subscription = await prisma.subscription.findFirst({
    where: { id: invoice.subscription as string },
  });

  if (!subscription) {
    if (attempts >= MAX_RETRIES) {
      console.error(`❌ Max retries reached for invoice: ${invoice.id}`);
      return;
    }

    console.warn(
      `⏳ Subscription not found. Retrying invoice (${attempts + 1})...`
    );
    await delay(3000);
    return await handleInvoice(invoice, eventType, attempts + 1);
  }

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amountPaid: invoice.amount_paid / 100,
      amountDue: eventType === "succeeded" ? 0 : invoice.amount_due / 100,
      amountRemaining: invoice.amount_remaining / 100,
      currency: invoice.currency,
      status: invoice.status?.toUpperCase() as InvoiceStatus,
      invoiceUrl: invoice.hosted_invoice_url ?? "",
    },
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
