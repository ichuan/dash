import type { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import * as consts from "@/app/consts";
import { sleep } from "@/app/utils";
import { getAllAssetSupplyRates } from "@/app/lib/aave";
import { AAVEV3Chains } from "@/app/consts";

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60;

const savePrice = async (currency: string, price: number) => {
  const ts = new Date().getTime();
  const data = `${ts},${price.toFixed(8)}`;
  await kv.lpush(`${consts.KV_KEY_PRICE}:${currency}`, data);
  return data;
};

const _updatePrice = async (
  currency: string,
  tokenAddress: string,
  decimals: number = 6
) => {
  const url = "https://api.1inch.dev/fusion/quoter/v2.0/42161/quote/receive";
  const zeros = Array(decimals).fill("0").join("");
  const params = new URLSearchParams({
    fromTokenAddress: tokenAddress,
    toTokenAddress: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    amount: `200000${zeros}`,
    walletAddress: "0x0000000000000000000000000000000000000000",
    enableEstimate: "false",
    isLedgerLive: "true",
  });
  const apiKey = process.env.ONE_INCH_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not set in Environments");
  }
  const res = await fetch(`${url}?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}`, "User-Agent": "curl/7.74.0" },
  });
  const data = await res.json();
  if (data) {
    const fromTokenAmount = data.fromTokenAmount.substring(
      0,
      data.fromTokenAmount.length - (decimals - 6)
    );
    return await savePrice(
      currency,
      parseFloat(data.toTokenAmount) / parseFloat(fromTokenAmount)
    );
  }
};

const updatePrice = async () => {
  console.log("updating usdc...");
  const usdc = await _updatePrice(
    "usdc",
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831"
  );
  // sleep due to 1inch RPS
  await sleep(2);
  console.log("updating dai...");
  const dai = await _updatePrice(
    "dai",
    "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    18
  );
  return { usdc, dai };
};

const updateAAVE = async () => {
  console.log("updating AAVE supply rates...");
  const rates = await getAllAssetSupplyRates();
  const ts = new Date().getTime();
  const ratesDict: { [key: string]: string } = {};
  for (const [chainName, assetName, rate] of rates) {
    ratesDict[`${chainName} ${assetName}`] = rate;
  }
  // 顺序：按 consts 里的 chainName，然后 usdc 在前，usdt 在后
  const data = [];
  for (const chainName of AAVEV3Chains) {
    data.push(ratesDict[`${chainName} USDC`] || "");
    data.push(ratesDict[`${chainName} USDT`] || "");
  }
  // ts,0.1,,0.2,0.3,0.4
  const result = `${ts},${data.join(",")}`;
  await kv.lpush(`${consts.KV_KEY_AAVE}:1d`, result);
  return { ts, ...ratesDict };
};

const daily = async () => {
  // trim KV_KEY_PRICE
  for (const currency of consts.CURRENCIES) {
    await kv.ltrim(
      `${consts.KV_KEY_PRICE}:${currency}`,
      0,
      consts.KV_CHART_MAX_ITEMS
    );
  }

  // trim KV_KEY_AAVE
  // 30d (30*24*60/200==216min/dot, need 215*200/5==8600 1d's dots)
  await kv.ltrim(`${consts.KV_KEY_AAVE}:1d`, 0, 8600);
  return "done";
};

const hourly = async () => {
  // aggregate
  // 1d => 7d (7*24*60/200==50min/dot, need 50*200/5==2000 1d's dots)
  // 1d => 30d (30*24*60/200==216min/dot, need 215*200/5==8600 1d's dots)
  const data = await kv.lrange(`${consts.KV_KEY_AAVE}:1d`, 0, 8600);
  const data7d = data
    .slice(0, 2000)
    .filter((i, j) => j % 10 === 0)
    .slice(0, consts.KV_CHART_MAX_ITEMS);
  const data30d = data
    .filter((i, j) => j % 43 === 0)
    .slice(0, consts.KV_CHART_MAX_ITEMS);
  await kv.del(`${consts.KV_KEY_AAVE}:7d`);
  await kv.rpush(`${consts.KV_KEY_AAVE}:7d`, ...data7d);
  await kv.del(`${consts.KV_KEY_AAVE}:30d`);
  await kv.rpush(`${consts.KV_KEY_AAVE}:30d`, ...data30d);
  return "done";
};

const jobs: { [key: string]: () => any } = {
  updatePrice,
  hourly,
  daily,
  updateAAVE,
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const params = request.nextUrl.searchParams;
  const job = params.get("job") || "";
  if (!jobs.hasOwnProperty(job)) {
    return Response.json({ error: `Unknown Job: ${job}` }, { status: 400 });
  }
  try {
    return Response.json({ result: await jobs[job]() });
  } catch (e) {
    return Response.json({ error: `${e}` }, { status: 400 });
  }
}
