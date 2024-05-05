import { LINKS } from "@/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
   
    return NextResponse.redirect(`${LINKS.shikimori}/oauth/authorize?client_id=${process.env.SHIKIMORI_OAUTH_CLIENT_ID}&redirect_uri=${process.env.SHIKIMORI_OAUTH_REDIRECT_URL}&response_type=code&scope=user_rates`);

    // try {


    //     return NextResponse.json({ ...data }, { status: 200 });
    // } catch (err) {
    //     if (err instanceof FetchError) {
    //         return NextResponse.json(
    //             new ServerError(err.name, err.message, err.data),
    //             { status: err.status },
    //         );
    //     }

    //     return NextResponse.json(
    //         new ServerError("UnhandledError", "Was not able to fetch shikimori people with id " + id),
    //         { status: 500 },
    //     );
    // }
}