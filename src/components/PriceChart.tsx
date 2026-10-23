import { useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { PricePoint, RangeId } from '../data/types';
import { formatPrice, formatUtcDay, formatUtcDayTime, formatUtcTime } from '../lib/format';
import { useElementWidth } from '../lib/useElementWidth';

interface PriceChartProps {
  points: PricePoint[] | null;
  range: RangeId;
  height?: number;
  label: string;
  /** Hide axes for compact thumbnails. */
  compact?: boolean;
}

const PAD = { top: 12, right: 72, bottom: 28, left: 4 };
const PAD_COMPACT = { top: 6, right: 6, bottom: 6, left: 6 };

function niceTicks(min: number, max: number, count = 4) {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) ticks.push(v);
  return ticks;
}

export function PriceChart({ points, range, height = 260, label, compact = false }: PriceChartProps) {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const pad = compact ? PAD_COMPACT : PAD;

  const model = useMemo(() => {
    if (!points?.length) return null;
    const prices = points.map((p) => p.p);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const margin = (hi - lo) * 0.12 || hi * 0.001;
    const yMin = lo - margin;
    const yMax = hi + margin;
    const iw = Math.max(10, width - pad.left - pad.right);
    const ih = height - pad.top - pad.bottom;
    const x = (i: number) => pad.left + (i / (points.length - 1)) * iw;
    const y = (p: number) => pad.top + (1 - (p - yMin) / (yMax - yMin)) * ih;
    const d = points.map((pt, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(pt.p).toFixed(1)}`).join('');
    const yTicks = niceTicks(yMin, yMax, compact ? 2 : 4).filter((v) => v >= yMin && v <= yMax);
    const xTickIdx = [0, 1, 2, 3].map((k) => Math.round((k / 3) * (points.length - 1)));
    return { lo, hi, x, y, d, yTicks, xTickIdx, iw, ih, first: points[0], last: points[points.length - 1] };
  }, [points, width, height, compact, pad.left, pad.right, pad.top, pad.bottom]);

  const xLabel = (t: number) => (range === '24H' ? formatUtcTime(t).replace(' UTC', '') : formatUtcDay(t));

  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    if (!model || !points) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - pad.left) / model.iw;
    setActive(Math.max(0, Math.min(points.length - 1, Math.round(rel * (points.length - 1)))));
  };

  const onKey = (e: KeyboardEvent) => {
    if (!points) return;
    const step = e.shiftKey ? 10 : 1;
    const cur = active ?? points.length - 1;
    let next = cur;
    if (e.key === 'ArrowLeft') next = Math.max(0, cur - step);
    else if (e.key === 'ArrowRight') next = Math.min(points.length - 1, cur + step);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = points.length - 1;
    else if (e.key === 'Escape') return setActive(null);
    else return;
    e.preventDefault();
    setActive(next);
  };

  const activePt = active != null && points ? points[active] : null;
  const change = model ? (model.last.p / model.first.p - 1) * 100 : 0;
  const summary = model
    ? `${label}. ${range} range from ${formatPrice(model.first.p)} to ${formatPrice(model.last.p)}, ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)} percent. High ${formatPrice(model.hi)}, low ${formatPrice(model.lo)}.`
    : `${label}. Loading.`;

  return (
    <div className={`chart${compact ? ' chart--compact' : ''}`} ref={wrapRef} style={{ height }}>
      {!model ? (
        <div className="skeleton" style={{ height: '100%' }} aria-hidden="true" />
      ) : (
        <>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={summary}
            tabIndex={compact ? -1 : 0}
            onPointerMove={compact ? undefined : onPointer}
            onPointerLeave={() => setActive(null)}
            onKeyDown={compact ? undefined : onKey}
            onBlur={() => setActive(null)}
            className="chart__svg"
          >
            {!compact && (
              <g aria-hidden="true">
                {model.yTicks.map((v) => (
                  <g key={v}>
                    <line x1={pad.left} x2={pad.left + model.iw} y1={model.y(v)} y2={model.y(v)} className="chart__grid" />
                    <text x={width - pad.right + 10} y={model.y(v)} dy="0.35em" className="chart__axis">
                      {formatPrice(v)}
                    </text>
                  </g>
                ))}
                {model.xTickIdx.map((idx, k) => (
                  <text
                    key={idx}
                    x={model.x(idx)}
                    y={height - 8}
                    textAnchor={k === 0 ? 'start' : k === 3 ? 'end' : 'middle'}
                    className="chart__axis"
                  >
                    {xLabel(points![idx].t)}
                  </text>
                ))}
                <line
                  x1={pad.left}
                  x2={pad.left + model.iw}
                  y1={model.y(model.first.p)}
                  y2={model.y(model.first.p)}
                  className="chart__ref"
                />
              </g>
            )}
            <path d={model.d} className="chart__line" />
            {!compact && (
              <circle cx={model.x(points!.length - 1)} cy={model.y(model.last.p)} r="4" className="chart__last" />
            )}
            {activePt && (
              <g aria-hidden="true">
                <line x1={model.x(active!)} x2={model.x(active!)} y1={pad.top} y2={pad.top + model.ih} className="chart__cross" />
                <circle cx={model.x(active!)} cy={model.y(activePt.p)} r="5" className="chart__dot" />
              </g>
            )}
          </svg>
          {activePt && (
            <div
              className="chart__tip"
              role="status"
              style={{
                left: Math.min(Math.max(model.x(active!), 70), width - pad.right - 10),
                top: 0,
              }}
            >
              <span className="num chart__tip-price">{formatPrice(activePt.p)}</span>
              <span className="chart__tip-time">{formatUtcDayTime(activePt.t)}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
