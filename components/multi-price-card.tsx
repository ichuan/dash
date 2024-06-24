"use client";

import { toast } from "sonner";
import { Currency, KlineData } from "@/app/lib/definitions";
import KlineChart from "@/components/kline-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function MultiPriceCard({ api }: { api: string }) {
  const [titles, setTitles] = useState([] as string[]);
  const [data, setData] = useState([] as KlineData);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1d");
  useEffect(() => {
    setIsLoading(true);
    const url = `${api}?range=${timeRange}`;
    const fetchData = async () => {
      const res = await fetch(url);
      const ret: { titles: string[]; data: string[] } = await res.json();
      const _titles = Array.prototype.concat.apply(
        [],
        ret.titles.map((i) => [`${i} USDC`, `${i} USDT`])
      );
      setTitles(_titles);
      const _data = [];
      for (const i of ret.data) {
        const [ts, ...rates] = i.split(",");
        const k: any = { ts: parseInt(ts) };
        for (let j = 0; j < rates.length; j++) {
          if (rates[j]) {
            k[_titles[j]] = parseFloat(rates[j]);
          }
        }
        _data.push(k);
      }
      setData(_data);
      setIsLoading(false);
    };
    fetchData().catch((err) => {
      console.error(err);
      toast(`Error fetching ${url}`, { description: `${err}` });
    });
  }, [api, timeRange]);
  return (
    <Card>
      <CardHeader className='space-y-0 flex flex-row items-center'>
        <div className='grid gap-2'>
          <CardTitle>AAVE Supply Rates (v3)</CardTitle>
          <CardDescription>Supply rates of USDT and USDC</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select a value'
          >
            <SelectValue placeholder='Last 24 hours' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='1d' className='rounded-lg'>
              Last 24 hours
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              Last 7 days
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-[400px] w-full rounded-xl' />
        ) : (
          <KlineChart
            data={data}
            areaKeys={titles}
            yTickFormatter={(i) => `${(i * 100).toFixed(2)}%`}
          />
        )}
      </CardContent>
    </Card>
  );
}
