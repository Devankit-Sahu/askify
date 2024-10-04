import { getUserSubscriptionPlan, stripe } from "@/lib/stripe.config";
import { NextResponse } from "next/server";
import prisma from "@/lib/db.config";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const origin = req.headers.get("origin");

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && user.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${origin}/dashboard/billing`,
      });

      return NextResponse.json({ url: session.url, status: 200 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO_TEST,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/billing`,
      cancel_url: `${origin}/dashboard/pricing`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url, status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}