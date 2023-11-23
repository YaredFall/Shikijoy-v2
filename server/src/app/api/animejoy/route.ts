import { LINKS } from "@/utils";
import got from "got";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  if (!search.toString().includes("?url=")) {
    return new Response("Please specify the URL in the 'url' query string.", { status: 400 });
  }
  const url = decodeURIComponent(search.replace("?url=", ""));

  const { headers, body } = (await got(`${LINKS.pupflare}/?url=${LINKS.animejoy}${url}`));

  return new Response(body, { headers: { "Content-Type": headers["content-type"]! } });
}