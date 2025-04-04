import { NextResponse } from "next/server";
import { loggedInUser } from "@/app/actions";
import { stripe } from "@/lib/stripe.config";

export async function POST(req: Request) {
  try {
    const user = await loggedInUser();

    const origin = req.headers.get("origin");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.stripeCustomerId) {
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
      success_url: `${origin}/subscription/success`,
      cancel_url: `${origin}/subscription/cancel`,
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
