import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {

    const cookie = cookies();
    cookie.delete("shikimori_at");
    cookie.delete("shikimori_rt");

    return NextResponse.json({ success: true }, { status: 200 });
}