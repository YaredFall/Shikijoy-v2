import { AuthResponse, fetchShikimoriAPI } from "@/app/api/shikimori/_utils";
import { LINKS } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {


    const accessToken = request.cookies.get("shikimori_at")?.value;
    if (!accessToken) {
        return new NextResponse("<h1>Not authorized</h1>", { status: 401 });
    }

    try {
        const data = await fetchShikimoriAPI<AuthResponse>(`/users/whoami`, {
            headers: {
                Authorization: accessToken,
            },
        });

        // const response = NextResponse.redirect(`http://localhost:5173/shikijoy/auth-callback?code=${code}`);
        const response = NextResponse.json(data);


        return response;
    } catch (err) {
        console.log(err);
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