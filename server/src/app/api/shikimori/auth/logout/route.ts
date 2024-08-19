import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {

    const cookie = cookies();
    cookie.delete({ name: "shikimori_at", sameSite: false });
    cookie.delete({ name: "shikimori_rt", sameSite: false });

    return NextResponse.json({ success: true }, { status: 200 });
}