import { ServerError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { User } from "node-shikimori";
import { ofetch } from "ofetch";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {

    const accessToken = request.headers.get("Authorization");
    if (!accessToken) return NextResponse.json(new ServerError("ClientError", "Not authorized"), { status: 401 });

    try {
        const data = await ofetch<User>(`/users/whoami`, {
            headers: {
                Authorization: accessToken,
            },
        });

        // const response = NextResponse.redirect(`http://localhost:5173/shikijoy/auth-callback?code=${code}`);
        const response = NextResponse.json(data);


        return response;
    } catch (err) {
        console.error(err);
        return new NextResponse("<h1>Oh shit!</h1>", { status: 400 });
    }


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