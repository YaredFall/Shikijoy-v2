import { fetchShikimoriAPI } from "@/app/api/shikimori/_utils";
import { db } from "@/lib/drizzle/db";
import { selectWatchStamps, stampsByAnimeIdAndUserFilter } from "@/lib/drizzle/query/watch-stamps";
import { watchStampFilterSchema, watchStampInsertSchema, watchStamps } from "@/lib/drizzle/schema/watch-stamp";
import { NextRequest, NextResponse } from "next/server";
import type { ShikimoriUser } from "@client/types/shikimori";
import { and, eq } from "drizzle-orm";

async function getShikimoriUser(request: NextRequest) {
    const shikimoriToken = request.cookies.get("shikimori_at")?.value;

    if (!shikimoriToken) {
        return Response.json({
            message: "Unauthorized",
            details: "Shikimori user access token was not provided",
        }, {
            status: 401,
        });
    }

    try {
        return {
            data: await fetchShikimoriAPI<ShikimoriUser>(`/users/whoami`, {
                headers: {
                    Authorization: shikimoriToken,
                },
            }),
        };
    } catch (error) {
        return Response.json({
            message: "Failed to get user",
            details: error,
        }, {
            status: 500,
        });
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const animejoyAnimeId = searchParams.get("animejoy_anime_id");


    const shikimoriUserResponse = await getShikimoriUser(request);
    if (shikimoriUserResponse instanceof Response) return shikimoriUserResponse;

    const parsedParams = watchStampFilterSchema.safeParse({
        animejoyAnimeId,
        shikimoriUserId: shikimoriUserResponse.data.id,
        // animejoyUserId,
    });

    if (!parsedParams.success) {
        return NextResponse.json({
            message: "Incorrect query params",
            details: parsedParams.error,
        }, {
            status: 400,
        });
    }

    try {
        const watchstamps = await selectWatchStamps(parsedParams.data);

        return Response.json(watchstamps, { status: 200 });
    } catch (error) {
        return Response.json({
            message: "DB query error!",
            details: error,
        }, {
            status: 400,
        });
    }
}

export async function POST(request: NextRequest) {
    const requestData = await request.json();

    const shikimoriUserResponse = await getShikimoriUser(request);
    if (shikimoriUserResponse instanceof Response) return shikimoriUserResponse;

    const parsedData = watchStampInsertSchema.safeParse({ ...requestData, shikimoriUserId: shikimoriUserResponse.data.id });

    if (!parsedData.success) {
        return NextResponse.json({
            message: "Invalid form data!",
            details: parsedData.error,
        }, {
            status: 400,
        });
    }

    try {
        await db.insert(watchStamps).values(parsedData.data);

        const watchstamps = await selectWatchStamps(parsedData.data);

        return Response.json(watchstamps, { status: 200 });
    } catch (error) {
        return Response.json({
            message: "DB query error!",
            details: error,
        }, {
            status: 400,
        });
    }

}

export async function DELETE(request: NextRequest) {
    const requestData = await request.json();

    const shikimoriUserResponse = await getShikimoriUser(request);
    if (shikimoriUserResponse instanceof Response) return shikimoriUserResponse;

    const parsedData = watchStampFilterSchema.safeParse({ ...requestData, shikimoriUserId: shikimoriUserResponse.data.id });

    if (!parsedData.success) {
        return NextResponse.json({
            message: "Invalid deletion filter!",
            details: parsedData.error,
        }, {
            status: 400,
        });
    }

    try {
        if (parsedData.data.src) {
            await db.delete(watchStamps).where(and(
                stampsByAnimeIdAndUserFilter(parsedData.data),
                eq(watchStamps.src, parsedData.data.src),
            ));
        } else {
            await db.delete(watchStamps).where(stampsByAnimeIdAndUserFilter(parsedData.data));
        }

        const watchstamps = await selectWatchStamps(parsedData.data);

        return Response.json(watchstamps, { status: 200 });
    } catch (err) {
        return Response.json({
            message: "Deletion failed!",
            details: err,
        }, {
            status: 400,
        });
    }
}