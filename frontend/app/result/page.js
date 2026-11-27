"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Activity,
  ArrowLeft,
  Download,
  RotateCcw,
  Info,
  HeartPulse,
} from "lucide-react";
import BeatPlot from "@/components/BeatPlot";

const RISK_META = {
  low: {
    label: "Low risk",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    accent: "text-emerald-600",
  },
  moderate: {
    label: "Moderate risk",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertTriangle,
    accent: "text-amber-600",
  },
  high: {
    label: "High risk",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertTriangle,
    accent: "text-orange-600",
  },
  critical: {
    label: "Critical — seek urgent care",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertOctagon,
    accent: "text-red-600",
  },
};

export default function ResultPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cs:lastResult");
      if (raw) setResult(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heartbeat-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-24">
        <div className="spinner" />
        <p className="mt-4 text-sm text-slate-500">Loading result…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
          <Info size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          No analysis to show yet
        </h1>
        <p className="mt-2 text-slate-600">
          Run an analysis first to see your prediction and recommended next
          steps.
        </p>
        <Link href="/predict" className="btn-primary mt-6 inline-flex">
          <Activity size={16} />
          Start an analysis
        </Link>
      </div>
    );
  }

  const risk = RISK_META[result.riskLevel] || RISK_META.moderate;
  const RiskIcon = risk.icon;

  // Sort probabilities descending
  const probs = Object.entries(result.probabilities).sort(
    (a, b) => b[1].value - a[1].value,
  );
  const topConfidencePct = (result.confidence * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Back + demo banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/predict"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          Back to analyzer
        </Link>
        {result.source === "demo" && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
            <Info size={12} />
            Synthetic demo beat, not a real recording
          </div>
        )}
      </div>

      {/* Headline card */}
      <div className="card overflow-hidden !p-0">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${risk.color}`}
            >
              <RiskIcon size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Predicted heartbeat type
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {result.className}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                {result.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Confidence"
              value={`${topConfidencePct}%`}
              detail={<ConfidenceBar value={result.confidence} />}
            />
            <KpiCard
              label="Risk level"
              value={risk.label}
              valueClassName={risk.accent}
            />
            <KpiCard
              label="Analyzed at"
              value={new Date(result.timestamp).toLocaleString()}
              small
            />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <div className="flex items-start gap-2 text-sm text-slate-700">
            <HeartPulse size={16} className="mt-0.5 shrink-0 text-primary-600" />
            <p>
              <span className="font-semibold">Recommendation: </span>
              {result.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Heartbeat + attribution */}
      <div className="card mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Analyzed heartbeat
            </h2>
            <p className="text-sm text-slate-500">
              Red shading marks the samples that influenced the prediction most
              (input × gradient).
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            MLII • 360 Hz • 360 samples
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <BeatPlot
            signal={result.signal}
            attribution={result.attribution}
            className="h-56 w-full"
          />
        </div>
      </div>

      {/* Probabilities */}
      <div className="card mt-6">
        <h2 className="text-base font-semibold text-slate-900">
          Class probabilities
        </h2>
        <p className="text-sm text-slate-500">
          How confident the model is across all five supported beat types.
        </p>
        <ul className="mt-5 space-y-3">
          {probs.map(([key, p], idx) => (
            <li key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">
                  {idx === 0 && (
                    <span className="mr-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700">
                      Top
                    </span>
                  )}
                  {p.name}
                </span>
                <span className="font-mono text-xs text-slate-600">
                  {(p.value * 100).toFixed(2)}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    idx === 0 ? "bg-primary-600" : "bg-slate-300"
                  }`}
                  style={{ width: `${p.value * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Input summary */}
      <div className="card mt-6">
        <h2 className="text-base font-semibold text-slate-900">
          Input summary
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <Info2 label="Source" value={result.source === "demo" ? "Synthetic demo" : "Uploaded file"} />
          <Info2 label="File" value={result.fileName || "—"} />
          <Info2 label="Samples" value={result.signal?.length ?? "—"} />
        </dl>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-xs text-slate-500">
          This output is advisory. It does not establish a diagnosis. This model classifies single heartbeats only.
          Please correlate clinically and refer to a cardiologist when indicated.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadReport}
            className="btn-secondary"
          >
            <Download size={16} />
            Download report
          </button>
          <Link href="/predict" className="btn-primary">
            <RotateCcw size={16} />
            Run new analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, detail, small, valueClassName = "" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div
        className={`mt-1 font-bold text-slate-900 ${
          small ? "text-sm" : "text-xl"
        } ${valueClassName}`}
      >
        {value}
      </div>
      {detail && <div className="mt-3">{detail}</div>}
    </div>
  );
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Info2({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-slate-900">
        {String(value)}
      </dd>
    </div>
  );
}
