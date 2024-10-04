import { Cache } from "@yaredfall/memcache";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchShikimoriAPI } from "@server/app/api/shikimori/_utils";
import { FetchError } from "ofetch";
import { ServerError } from "@server/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 12;

const cache = new Cache({ defaultTtl: revalidate * 1000 });

const paramsSchema = z.object({
    id: z.coerce.number().int().min(1),
});

type RouteParams = {
    params: {
        id: z.infer<typeof paramsSchema>;
    };
};

export async function GET(request: NextRequest, { params }: RouteParams) {

    const parseResult = paramsSchema.safeParse(params);
    if (!parseResult.success) {
        return NextResponse.json(new ServerError("ClientError", "Invalid 'id' parameter"), { status: 400 });
    }
    const { id } = parseResult.data;

    const accessToken = cookies().get("shikimori_at")?.value;

    const cacheKey = request.url;

    try {
        let data = cache.get(cacheKey);
        if (!data) {
            console.log("skimori people data cache miss");
            data = await fetchShikimoriAPI("/people/" + id, {
                headers: {
                    Authorization: accessToken ?? "",
                },
            });
            cache.set(cacheKey, data!);
        } else {
            console.log("skimori people data cache hit");
        }

        return NextResponse.json({ ...data }, { status: 200 });
    } catch (err) {
        if (err instanceof FetchError) {
            return NextResponse.json(
                new ServerError(err.name, err.message, err.data),
                { status: err.status },
            );
        }

        return NextResponse.json(
            new ServerError("UnhandledError", "Was not able to fetch shikimori people with id " + id),
            { status: 500 },
        );
    }
}