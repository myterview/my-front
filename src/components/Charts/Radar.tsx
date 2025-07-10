"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TickItemTextProps } from "recharts/types/polar/PolarAngleAxis";

export function Radar({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={360} className={"mx-auto"}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={CustomTick} />
        <PolarRadiusAxis angle={30} tick={false} domain={[0, 100]} />
        <RechartsRadar
          name="점수"
          dataKey="value"
          stroke="#2b8eff"
          fill="#2b8eff"
          fillOpacity={0.6}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function CustomTick({ payload, x, y, textAnchor, cx, cy }: TickItemTextProps) {
  const lines = payload.value.split(" ").join("\n").split("\n");

  // 중심점 (차트의 중심)
  const centerX = cx;
  const centerY = cy;

  // 현재 위치에서 중심점까지의 벡터 계산
  const deltaX = (x as number) - (centerX as number);
  const deltaY = (y as number) - (centerY as number);

  // 벡터를 정규화하고 원하는 거리만큼 확장
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const offsetDistance = 12; // 텍스트를 얼마나 더 멀리 배치할지 (픽셀)

  const newX = (x as number) + (deltaX / distance) * offsetDistance;
  const newY = (y as number) + (deltaY / distance) * offsetDistance;

  return (
    <text
      x={newX}
      y={newY}
      textAnchor={textAnchor}
      dy={8}
      fontSize={14}
      fontWeight={700}
    >
      {lines.map((line: string, i: number) => (
        <tspan x={x} dy={i === 0 ? 0 : 16} key={i}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
