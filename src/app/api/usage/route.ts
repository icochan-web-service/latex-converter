import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  basic: 500,
  pro: 5000,
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const supabase = getSupabase();

  // ユーザーレコードの存在確認 → なければ自動INSERT
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingUser) {
    try {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email,
        plan: "free",
        stripe_customer_id: null,
        stripe_subscription_id: null,
      });
      if (insertError) {
        console.error("ユーザー自動作成エラー:", insertError);
      }
    } catch (e) {
      console.error("ユーザー自動作成中に例外が発生しました:", e);
    }
  }

  // ユーザーのプランを取得
  const { data: userData } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = userData?.plan ?? "free";
  const limit = PLAN_LIMITS[plan] ?? 10;

  // 今月の変換枚数を取得
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

  const { count, error } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const used = count ?? 0;

  return NextResponse.json({
    used,
    limit,
    remaining: Math.max(0, limit - used),
    plan,
  });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const count =
    typeof body.count === "number" && body.count > 0
      ? Math.floor(body.count)
      : 1;

  const supabase = getSupabase();
  const records = Array.from({ length: count }, () => ({ user_id: userId }));
  const { error } = await supabase.from("conversions").insert(records);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, consumed: count });
}