// Plots one 360-sample heartbeat. If `attribution` is given, the background is
// shaded by |attribution| to show which samples drove the prediction.
export default function BeatPlot({ signal, attribution, className = "" }) {
  if (!Array.isArray(signal) || signal.length === 0) return null;

  const W = 720;
  const H = 220;
  const padX = 12;
  const padY = 16;
  const n = signal.length;

  const min = Math.min(...signal);
  const max = Math.max(...signal);
  const span = max - min || 1;
  const x = (i) => padX + (i / (n - 1)) * (W - 2 * padX);
  const y = (v) => H - padY - ((v - min) / span) * (H - 2 * padY);

  const path = signal
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");

  const hasAttr = Array.isArray(attribution) && attribution.length === n;
  const maxAttr = hasAttr
    ? Math.max(...attribution.map((a) => Math.abs(a))) || 1
    : 1;
  const barW = (W - 2 * padX) / n;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="ECG heartbeat waveform"
    >
      {hasAttr &&
        attribution.map((a, i) => (
          <rect
            key={i}
            x={x(i) - barW / 2}
            y={0}
            width={barW + 0.5}
            height={H}
            fill="#dc2626"
            opacity={(Math.abs(a) / maxAttr) * 0.45}
          />
        ))}

      {/* R-peak marker at index 180 */}
      <line
        x1={x(180)}
        x2={x(180)}
        y1={0}
        y2={H}
        stroke="#94a3b8"
        strokeDasharray="4 4"
        strokeWidth="1"
      />
      <text x={x(180) + 6} y={14} fontSize="11" fill="#64748b">
        R-peak
      </text>

      <path
        d={path}
        fill="none"
        stroke="#0f172a"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
