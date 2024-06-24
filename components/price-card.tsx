'use client'

import { toast } from "sonner"
import { Currency } from '@/app/lib/definitions'
import KlineChart from '@/components/kline-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {useState, useEffect} from 'react'


export default function PriceCard({currency}: {currency: Currency}) {
  let currencyUpper = currency.toUpperCase()
  const [latestPrice, setLatestPrice] = useState(0)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/kline/${currency}`)
      const ret = await res.json()
      const _data = ret.data.map((i: any) => {
        const [ts,price] = i.split(',')
        return {ts:parseInt(ts),price:parseFloat(price)}
      })
      setData(_data)
      if (_data.length) {
        setLatestPrice(_data[_data.length - 1].price)
      }
      setIsLoading(false)
    }
    fetchData().catch((err) => {
      console.error(err)
      toast(`Error fetching ${currency.toUpperCase()} data`, {description: `${err}`})
    })
  }, [currency])
  return (
    <Card>
      <CardHeader className="space-y-0 flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{currencyUpper} price</CardTitle>
          <CardDescription>
            Price estimated from 1inch on Arbitrum chain
          </CardDescription>
        </div>
        {latestPrice ? (
          <div className="ml-auto">1 {currencyUpper} = { latestPrice } USDT</div>
        ) : ''}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : (
          <KlineChart data={data} areaKeys={['price']} yTickFormatter={(i) => i.toFixed(4)}/>
        )}
      </CardContent>
    </Card>
  )
}
