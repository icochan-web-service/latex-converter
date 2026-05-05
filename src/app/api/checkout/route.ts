import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        userId,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[api/checkout] Stripeエラー:", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}