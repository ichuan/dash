import * as consts from "@/app/consts";
import { type NextRequest } from "next/server";
import { httpError } from "@/app/utils";
import { kv } from "@vercel/kv";
import { AAVEV3Chains, AAVE_RANGES } from "@/app/consts";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") || "1d";
  if (!AAVE_RANGES.includes(range)) {
    return httpError(`Invalid range: ${range}`);
  }
  try {
    const list = await kv.lrange(
      `${consts.KV_KEY_AAVE}:${range}`,
      0,
      consts.KV_CHART_MAX_ITEMS
    );
    return Response.json({ titles: AAVEV3Chains, data: list.toReversed() });
  } catch (e) {
    console.error(e);
    return httpError("error fetching db");
  }
}
