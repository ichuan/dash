import * as consts from "@/app/consts";
import { httpError } from "@/app/utils";
import { kv } from "@vercel/kv";

export async function GET(request: Request, { params }: { params: any }) {
  const currency = params.currency;
  if (!consts.CURRENCIES.includes(currency)) {
    return httpError(`Invalid currency: ${currency}`);
  }
  try {
    const latest = await kv.lindex(`${consts.KV_KEY_PRICE}:${currency}`, 0);
    const [ts, price] = latest.split(",");
    return Response.json({ currency, ts, price });
  } catch (e) {
    console.error(e);
    return httpError("error fetching db");
  }
}
