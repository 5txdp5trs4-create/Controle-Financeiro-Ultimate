import { useEffect, useRef } from "react";

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export default function LineChart({ data, height = 300, color = 'hsl(var(--chart-1))' }: LineChartProps) {
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
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue;

    const xStep = chartWidth / (data.length - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    data.forEach((item, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + innerHeight - ((item.value - minValue) / valueRange) * innerHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() 
      ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground')})` 
      : '#888';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    data.forEach((item, index) => {
      const x = padding.left + index * xStep;
      ctx.fillText(item.label, x, chartHeight - 10);

      const y = padding.top + innerHeight - ((item.value - minValue) / valueRange) * innerHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
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
