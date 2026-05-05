import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error("[api/webhook] 署名検証エラー:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        const { error: upsertError } = await supabase.from("users").upsert({
          id: userId,
          plan: "basic",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          updated_at: new Date().toISOString(),
        });

        if (upsertError) {
          console.error("[api/webhook] checkout upsertエラー:", upsertError);
          return NextResponse.json({ error: "DB更新失敗" }, { status: 500 });
        }

        console.log(`[api/webhook] ユーザー ${userId} をBasicプランに更新しました`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      if (status === "past_due" || status === "unpaid" || status === "canceled") {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            plan: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error("[api/webhook] subscription.updated 更新エラー:", updateError);
          return NextResponse.json({ error: "DB更新失敗" }, { status: 500 });
        }

        console.log("[api/webhook] サブスクリプション状態変更→free:", customerId, status);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await supabase
        .from("users")
        .update({
          plan: "free",
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error("[api/webhook] 解約処理エラー:", error);
        return NextResponse.json({ error: "DB更新失敗" }, { status: 500 });
      }

      console.log("[api/webhook] サブスクリプション解約処理完了:", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}