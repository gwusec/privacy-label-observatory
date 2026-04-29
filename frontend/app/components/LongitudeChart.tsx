import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { useTheme } from 'next-themes';
import 'chartjs-adapter-date-fns';
import { type TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

interface RunData {
    index: string;
    date: string;
    values: {
      ALL_APPS: number;
      EXISTS_PRIVACY_LABELS: number;
      DATA_USED_TO_TRACK_YOU: number;
      DATA_LINKED_TO_YOU: number;
      DATA_NOT_COLLECTED: number;
      DATA_NOT_LINKED_TO_YOU: number;
    };
  }

interface LineChartProps {
  data: RunData[];
  isExpanded: boolean;
}

const GAP_THRESHOLD_DAYS = 45;

function detectGaps(entries: [string, RunData][]): { start: Date; end: Date }[] {
  const gaps: { start: Date; end: Date }[] = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const curr = new Date(entries[i][1].date);
    const next = new Date(entries[i + 1][1].date);
    const daysDiff = (next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > GAP_THRESHOLD_DAYS) {
      gaps.push({ start: curr, end: next });
    }
  }
  return gaps;
}

const LongitudeChart: React.FC<LineChartProps> = ({ data, isExpanded }) => {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chartjs-plugin-zoom").then((zoomPlugin) => {
        ChartJS.register(zoomPlugin.default);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const entries = Object.entries(data).filter(([k]) => k !== 'id') as [string, RunData][];
  const gaps = detectGaps(entries);

  const labels: Date[] = entries.map(([, run]) => new Date(run.date));

  const buildData = (key: keyof RunData['values']): number[] =>
    entries.map(([, run]) => run.values[key]);

  const segmentBorderDash = (ctx: any) => {
    const p0 = labels[ctx.p0DataIndex];
    const p1 = labels[ctx.p1DataIndex];
    if (!p0 || !p1) return undefined;
    const isGapSegment = gaps.some(
      g => p0.getTime() >= g.start.getTime() && p1.getTime() <= g.end.getTime()
    );
    return isGapSegment ? [6, 6] : undefined;
  };

  const segmentBorderColor = (ctx: any, color: string) => {
    const p0 = labels[ctx.p0DataIndex];
    const p1 = labels[ctx.p1DataIndex];
    if (!p0 || !p1) return color;
    const isGapSegment = gaps.some(
      g => p0.getTime() >= g.start.getTime() && p1.getTime() <= g.end.getTime()
    );
    return isGapSegment ? color.replace('1)', '0.35)') : color;
  };

  const makeDataset = (
    label: string,
    key: keyof RunData['values'],
    borderColor: string,
    backgroundColor: string
  ) => ({
    label,
    data: buildData(key),
    borderColor,
    backgroundColor,
    borderWidth: 3,
    tension: 0.1,
    pointRadius: (ctx: any) => {
      const index = ctx.dataIndex;
      const date = labels[index];
      if (!date) return 0;
      const isEdge = gaps.some(
        g =>
          Math.abs(date.getTime() - g.start.getTime()) < 1 * 24 * 60 * 60 * 1000 ||
          Math.abs(date.getTime() - g.end.getTime()) < 1 * 24 * 60 * 60 * 1000
      );
      return isEdge ? 4 : 0;
    },
    pointHoverRadius: 5,
    pointHitRadius: 16,
    spanGaps: true,
    segment: {
      borderDash: segmentBorderDash,
      borderColor: (ctx: any) => segmentBorderColor(ctx, borderColor),
      backgroundColor: (ctx: any) => {
        const p0 = labels[ctx.p0DataIndex];
        const p1 = labels[ctx.p1DataIndex];
        if (!p0 || !p1) return backgroundColor;
        const isGapSegment = gaps.some(
          g => p0.getTime() >= g.start.getTime() && p1.getTime() <= g.end.getTime()
        );
        return isGapSegment ? 'transparent' : backgroundColor;
      },
    },
  });

  const chartData = {
    labels,
    datasets: [
      makeDataset('Total Apps',             'ALL_APPS',              'rgba(255, 159, 64, 1)',  'rgba(255, 159, 64, 0.2)'),
      makeDataset('Compliant Apps',         'EXISTS_PRIVACY_LABELS', 'rgba(255, 99, 132, 1)',  'rgba(255, 99, 132, 0.2)'),
      makeDataset('Data Not Collected',     'DATA_NOT_COLLECTED',    'rgba(255, 206, 86, 1)',  'rgba(255, 206, 86, 0.2)'),
      makeDataset('Data Not Linked to You', 'DATA_NOT_LINKED_TO_YOU','rgba(54, 162, 235, 1)',  'rgba(54, 162, 235, 0.2)'),
      makeDataset('Data Linked to You',     'DATA_LINKED_TO_YOU',    'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)'),
      makeDataset('Data Used to Track You', 'DATA_USED_TO_TRACK_YOU','rgba(75, 192, 192, 1)',  'rgba(75, 192, 192, 0.2)'),
      {
        label: '- - -  No Data',
        data: [] as number[],
        borderColor: isDark ? 'rgba(150,150,150,0.7)' : 'rgba(100,100,100,0.6)',
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: { day: 'MMM dd, yyyy' },
        },
        title: {
          display: true,
          color: isDark ? '#f1f1f1' : '#1e1e1e',
          text: 'Run Date',
        },
        ticks: {
          color: isDark ? '#f1f1f1' : '#1e1e1e',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: isDark ? '#444444' : '#b9b9b9' },
      },
      y: {
        title: {
          color: isDark ? '#f1f1f1' : '#1e1e1e',
          display: true,
          text: 'Number of Apps',
        },
        ticks: { color: isDark ? '#f1f1f1' : '#1e1e1e' },
        grid: { color: isDark ? '#444444' : '#b9b9b9' },
        suggestedMax: 600000,
        max: undefined,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#ffffff' : '#000000',
        },
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        filter: (item: TooltipItem<'line'>) => {
          if (item.dataset.label === '- - -  No Data') return false;
          const hoveredDate = item.parsed.x;
          const inGap = gaps.some(
            g => hoveredDate > g.start.getTime() && hoveredDate < g.end.getTime()
          );
          return !inGap;
        },
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)',
        titleColor: isDark ? '#f1f1f1' : '#1e1e1e',
        bodyColor: isDark ? '#d1d1d1' : '#333333',
        borderColor: isDark ? '#444444' : '#cccccc',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => {
            if (!items.length) return '';
            const date = new Date(items[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              month: 'short', day: '2-digit', year: 'numeric',
            });
          },
          label: (item: TooltipItem<'line'>) => {
            if (item.dataset.label === '- - -  No Data') return undefined as any;
            const value = item.parsed.y;
            const formatted = value.toLocaleString();
            const totalDataset = item.chart.data.datasets[0];
            const totalValue = (totalDataset.data[item.dataIndex] as number) ?? 0;
            const pct = item.datasetIndex === 0 || totalValue === 0
              ? ''
              : ` (${((value / totalValue) * 100).toFixed(1)}% of total)`;
            return ` ${item.dataset.label}: ${formatted}${pct}`;
          },
          afterBody: (items: TooltipItem<'line'>[]) => {
            if (!items.length) return [];
            const idx = items[0].dataIndex;
            const chart = items[0].chart;
            const total = (chart.data.datasets[0]?.data[idx] as number) ?? 0;
            const compliant = (chart.data.datasets[1]?.data[idx] as number) ?? 0;
            if (!total) return [];
            return ['', `Compliance rate: ${((compliant / total) * 100).toFixed(1)}%`];
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
      axis: 'x' as const,
    },
    hover: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="w-full h-96 md:h-96 pb-10 pt-4">
      <Line
        data={chartData}
        options={options}
        ref={chartRef}
        plugins={[]}
      />
    </div>
  );
};

export default LongitudeChart;