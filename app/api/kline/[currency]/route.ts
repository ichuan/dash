import * as consts from "@/app/consts";
import { httpError } from "@/app/utils";
import { kv } from "@vercel/kv";

export const revalidate = 0;

export async function GET(request: Request, { params }: { params: any }) {
  const currency = params.currency;
  if (!consts.CURRENCIES.includes(currency)) {
    return httpError(`Invalid currency: ${currency}`);
  }
  try {
    const list = await kv.lrange(
      `${consts.KV_KEY_PRICE}:${currency}`,
      0,
      consts.KV_CHART_MAX_ITEMS
    );
    return Response.json({ currency, data: list.toReversed() });
  } catch (e) {
    console.error(e);
    return httpError("error fetching db");
  }
}
