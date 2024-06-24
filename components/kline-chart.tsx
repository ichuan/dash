"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { KlineData } from "@/app/lib/definitions";

const yDomain = ([min, max]: [number, number]): [number, number] => {
  let sub = (max - min) * 0.1;
  return [min - sub, max + sub];
};

const xTickFormatter = (ts: number) => {
  let date: Date = new Date(ts);
  return `${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

const getCustomTooltip = (
  colors: { [key: string]: string },
  yTickFormatter: (i: number) => string
) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    const wrapperStyle = {
      border: "1px solid white",
      background: "black",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
    };
    if (active && payload && payload.length) {
      return (
        <div style={wrapperStyle}>
          <p>
            <strong>{xTickFormatter(label)}</strong>
          </p>
          {payload.map((i) => (
            <p key={i.dataKey}>
              <span style={{ color: colors[i.dataKey || ""] }}>
                {i.dataKey}
              </span>
              : {yTickFormatter(i.value as number)}
            </p>
          ))}
        </div>
      );
    }
  };
  return CustomTooltip;
};

export default function KlineChart({
  data,
  areaKeys,
  yTickFormatter,
}: {
  data: KlineData;
  areaKeys: string[];
  yTickFormatter: (i: number) => string;
}) {
  const areaColors = Object.fromEntries(
    areaKeys.map((i, j) => [i, `hsl(var(--chart-${j}))`])
  );
  return (
    <ResponsiveContainer width='100%' height={400} style={{ fontSize: "12px" }}>
      <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          {[...Array(5)].map((_, i) => (
            <linearGradient
              key={i}
              id={`linear-gradient${i}`}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop
                offset='5%'
                stopColor={`hsl(var(--chart-${i}))`}
                stopOpacity='0.8'
              />
              <stop
                offset='95%'
                stopColor={`hsl(var(--chart-${i}))`}
                stopOpacity='0.1'
              />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey='ts' tickFormatter={xTickFormatter} />
        <YAxis domain={yDomain} tickFormatter={yTickFormatter} width={50} />
        <Tooltip
          cursor={false}
          content={getCustomTooltip(areaColors, yTickFormatter)}
        />
        {areaKeys.map((key, i) => (
          <Area
            key={key}
            type='monotone'
            dataKey={key}
            stroke={`hsl(var(--chart-${i}))`}
            fillOpacity={0.4}
            fill={`url(#linear-gradient${i})`}
          />
        ))}
        {areaKeys.length > 1 && <Legend iconType='rect' />}
      </AreaChart>
    </ResponsiveContainer>
  );
}
