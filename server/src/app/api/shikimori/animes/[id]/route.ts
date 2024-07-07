import { Cache } from "@yaredfall/memcache";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchShikimoriAPI } from "@/app/api/shikimori/_utils";
import { FetchError } from "ofetch";
import { ServerError } from "@/utils";
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

    console.log(request.url);
    const coreDataCacheKey = request.url + ":core";
    const charsDataCacheKey = request.url + ":chars";

    try {
        const getCoreData = async () => {
            let coreData = cache.get(coreDataCacheKey);
            if (!coreData) {
                console.log("skimori anime data cache miss");
                coreData = await fetchShikimoriAPI("/animes/" + id, {
                    headers: {
                        Authorization: accessToken ?? "",
                    },
                });
                cache.set(coreDataCacheKey, coreData!);
            } else {
                console.log("skimori anime data cache hit");
            }
            return coreData;
        };

        const getCharData = async () => {
            let charData = cache.get(charsDataCacheKey);
            if (!charData) {
                const roles = await fetchShikimoriAPI<Array<{ roles: string[]; }>>("/animes/" + id + "/roles");
                charData = roles.filter(r => r.roles.includes("Main") || r.roles.includes("Supporting"));

                cache.set(charsDataCacheKey, charData);
            }
            return charData;
        };

        const [coreData, charData] = await Promise.all([getCoreData(), getCharData()]);

        return NextResponse.json({ coreData, charData }, { status: 200 });
    } catch (err) {
        if (err instanceof FetchError) {
            return NextResponse.json(
                new ServerError(err.name, err.message, err.data),
                { status: err.status },
            );
        }

        return NextResponse.json(
            new ServerError("UnhandledError", "Was not able to fetch shikimori anime with id " + id),
            { status: 500 },
        );
    }
}