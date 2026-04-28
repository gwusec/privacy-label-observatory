import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale, Plugin } from 'chart.js';
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

function makeGapShadingPlugin(
  gaps: { start: Date; end: Date }[],
  isDark: boolean
): Plugin<'line'> {
  return {
    id: 'gapShading',
    beforeDraw(chart) {
      if (!gaps.length) return;
      const { ctx, chartArea, scales } = chart;
      const xScale = scales['x'];
      if (!xScale || !chartArea) return;

      ctx.save();
      gaps.forEach(({ start, end }) => {
        const x1 = xScale.getPixelForValue(start.getTime());
        const x2 = xScale.getPixelForValue(end.getTime());

        const gapWidth = x2 - x1;
        const bandHeight = chartArea.bottom - chartArea.top;

        // Clipped base fill
        ctx.save();
        ctx.beginPath();
        ctx.rect(x1, chartArea.top, gapWidth, bandHeight);
        ctx.clip();
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
        ctx.fillRect(x1, chartArea.top, gapWidth, bandHeight);
        ctx.restore();

        // Dashed border lines
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, chartArea.top);
        ctx.lineTo(x1, chartArea.bottom);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, chartArea.top);
        ctx.lineTo(x2, chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Only show label if gap is wide enough
        const midX = (x1 + x2) / 2;
        const midY = (chartArea.top + chartArea.bottom) / 2;
        if (gapWidth > 20) {
          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const label = 'NO DATA';
          const fontSize = Math.min(11, gapWidth * 0.3);
          ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;

          const textWidth = ctx.measureText(label).width;
          const padX = 8;
          const padY = 4;
          const rx = 4;
          const bx = -textWidth / 2 - padX;
          const by = -fontSize / 2 - padY;
          const bw = textWidth + padX * 2;
          const bh = fontSize + padY * 2;

          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, rx);
          ctx.fillStyle = isDark ? 'rgba(30,30,30,0.75)' : 'rgba(255,255,255,0.8)';
          ctx.fill();

          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      });
      ctx.restore();
    },
  };
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

  const labels: Date[] = [];
  const buildData = (key: keyof RunData['values']): (number | null)[] => {
    const map: (number | null)[] = [];
    const buildingLabels = labels.length === 0;

    for (let i = 0; i < entries.length; i++) {
      const [, run] = entries[i];
      if (buildingLabels) labels.push(new Date(run.date));
      map.push(run.values[key]);

      if (i < entries.length - 1) {
        const curr = new Date(run.date);
        const next = new Date(entries[i + 1][1].date);
        const daysDiff = (next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > GAP_THRESHOLD_DAYS) {
          const midpoint = new Date((curr.getTime() + next.getTime()) / 2);
          if (buildingLabels) labels.push(midpoint);
          map.push(null);
        }
      }
    }
    return map;
  };

  const allAppsData   = buildData('ALL_APPS');
  const compliantData = buildData('EXISTS_PRIVACY_LABELS');
  const dncData       = buildData('DATA_NOT_COLLECTED');
  const dnltyData     = buildData('DATA_NOT_LINKED_TO_YOU');
  const dltyData      = buildData('DATA_LINKED_TO_YOU');
  const dutyData      = buildData('DATA_USED_TO_TRACK_YOU');

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Apps',
        data: allAppsData,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
      {
        label: 'Compliant Apps',
        data: compliantData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
      {
        label: 'Data Not Collected',
        data: dncData,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
      {
        label: 'Data Not Linked to You',
        data: dnltyData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
      {
        label: 'Data Linked to You',
        data: dltyData,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
      {
        label: 'Data Used to Track You',
        data: dutyData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 16,
        spanGaps: false,
      },
    ].filter(dataset => dataset.data.some(d => d !== null)),
  };

  const gapShadingPlugin = makeGapShadingPlugin(gaps, isDark);

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
        grid: { color: isDark ? '#f1f1f1' : '#b9b9b9' },
      },
      y: {
        title: {
          color: isDark ? '#f1f1f1' : '#1e1e1e',
          display: true,
          text: 'Number of Apps',
        },
        ticks: { color: isDark ? '#f1f1f1' : '#1e1e1e' },
        grid: { color: isDark ? '#f1f1f1' : '#b9b9b9' },
        suggestedMax: 600000,
        max: undefined,
      },
    },
    plugins: {
      legend: {
        labels: { color: isDark ? '#ffffff' : '#000000' },
      },
      datalabels: {
        color: isDark ? '#ffffff' : '#000000',
        display: false,
      },
      tooltip: {
       filter: (item: TooltipItem<'line'>) => {
  const allNull = item.chart.data.datasets.every(
    ds => ds.data[item.dataIndex] === null
  );
  return !allNull && item.parsed.y !== null;
},
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)',
        opacity: 1,
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
            if (item.parsed.y === null) return undefined as any;
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
        plugins={[gapShadingPlugin]}
      />
    </div>
  );
};

export default LongitudeChart;