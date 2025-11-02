import { useEffect, useRef } from "react";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export default function BarChart({ data, height = 300, color = 'hsl(var(--chart-1))' }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const chartHeight = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, chartHeight);

    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length;

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() 
      ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground')})` 
      : '#888';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * innerHeight;
      const x = padding.left + index * barWidth + barWidth * 0.2;
      const y = padding.top + innerHeight - barHeight;
      const width = barWidth * 0.6;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, barHeight);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() 
        ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground')})` 
        : '#888';
      ctx.fillText(item.label, x + width / 2, chartHeight - 10);

      ctx.textAlign = 'center';
      ctx.fillText(
        item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }),
        x + width / 2,
        y - 5
      );
    });

  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px` }}
      className="rounded-lg"
    />
  );
}
