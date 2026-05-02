import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const FREE_LIMIT = 10; // テスト用（後で30に戻す）

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const supabase = getSupabase();

  // 今月の開始日（UTC）
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
    limit: FREE_LIMIT,
    remaining: Math.max(0, FREE_LIMIT - used),
  });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const supabase = getSupabase();

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

  const { count } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if ((count ?? 0) >= FREE_LIMIT) {
    return NextResponse.json(
      { error: "今月の無料枠を使い切りました" },
      { status: 403 }
    );
  }

  await supabase.from("conversions").insert({ user_id: userId });

  return NextResponse.json({ success: true });
}