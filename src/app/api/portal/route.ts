import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: userData } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (!userData?.stripe_customer_id) {
    return NextResponse.json({ error: "有料プランのサブスクリプションが見つかりません" }, { status: 404 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[api/portal] Stripeエラー:", error);
    return NextResponse.json(
      { error: "ポータルの起動に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
