export default function EcgWave({ className = "" }) {
  return (
    <svg
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ecgGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Grid */}
      <g stroke="#fecaca" strokeWidth="0.4" opacity="0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="120" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 30} x2="600" y2={i * 30} />
        ))}
      </g>

      {/* ECG line */}
      <path
        d="M0,60 L80,60 L95,55 L110,65 L120,20 L130,100 L140,60 L220,60 L235,55 L250,65 L260,20 L270,100 L280,60 L360,60 L375,55 L390,65 L400,20 L410,100 L420,60 L500,60 L515,55 L530,65 L540,20 L550,100 L560,60 L600,60"
        fill="none"
        stroke="url(#ecgGrad)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ecg-path"
      />
    </svg>
  );
}
