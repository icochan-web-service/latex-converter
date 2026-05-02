import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FREE_LIMIT = 10;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  // 今月の変換枚数を取得
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return NextResponse.json({
    used: count ?? 0,
    limit: FREE_LIMIT,
    remaining: Math.max(0, FREE_LIMIT - (count ?? 0)),
  });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  // 今月の変換枚数を確認
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if ((count ?? 0) >= FREE_LIMIT) {
    return NextResponse.json(
      { error: "今月の無料枠（10枚）を使い切りました" },
      { status: 403 }
    );
  }

  // 変換履歴を記録
  await supabase.from("conversions").insert({ user_id: userId });

  return NextResponse.json({ success: true });
}