"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Upload,
  Info,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  predictBeat,
  parseBeatFile,
  getHealth,
  API_URL,
  WINDOW_SIZE,
} from "@/lib/api";

export default function PredictPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [api, setApi] = useState({ state: "checking" }); // checking | ready | degraded | offline

  useEffect(() => {
    getHealth()
      .then((h) => setApi({ state: h.model_loaded ? "ready" : "degraded" }))
      .catch(() => setApi({ state: "offline" }));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please choose a heartbeat file.");
      return;
    }
    setSubmitting(true);
    try {
      const signal = await parseBeatFile(file);
      const result = await predictBeat(signal, {
        source: "upload",
        fileName: file.name,
      });
      sessionStorage.setItem("cs:lastResult", JSON.stringify(result));
      router.push("/result");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          <Activity size={14} />
          Analysis
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Classify a heartbeat
        </h1>
        <p className="mt-2 text-slate-600">
          Upload a single segmented ECG heartbeat. The MSHAN model predicts one
          of five beat types: Normal, LBBB, RBBB, Atrial premature, or
          Ventricular premature.
        </p>
        <ApiStatus state={api.state} />
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="card">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
              <Upload size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                ECG heartbeat file
              </h2>
              <p className="text-sm text-slate-500">
                CSV, TXT, or JSON containing exactly {WINDOW_SIZE} amplitude
                values.
              </p>
            </div>
          </div>

          <label
            htmlFor="ecgFile"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 transition hover:border-primary-400 hover:bg-primary-50/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-700">
              <Upload size={20} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">
                {file ? file.name : "Click to choose a file"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supported: .csv, .txt, .json
              </p>
            </div>
            <input
              id="ecgFile"
              type="file"
              accept=".csv,.txt,.json"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError("");
              }}
            />
          </label>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>
              Input must be <b>one heartbeat</b> from the <b>MLII lead</b>,
              sampled at <b>360 Hz</b>, with <b>{WINDOW_SIZE} values</b> and the
              R-peak at index <b>180</b>. CSV: one row of {WINDOW_SIZE} values,
              or one column of {WINDOW_SIZE} values. JSON:{" "}
              <code>{`{"signal": [ ... ]}`}</code>. Normalization is applied
              automatically.
            </span>
          </div>
        </section>

        <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Research tool for single-beat classification. It is not a clinical
            diagnosis.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setFile(null);
                setError("");
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !file || api.state === "offline"}
            >
              {submitting ? (
                <>
                  <span className="spinner !h-4 !w-4 !border-2" />
                  Analyzing…
                </>
              ) : (
                <>
                  Run analysis
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ApiStatus({ state }) {
  const map = {
    checking: { cls: "bg-slate-100 text-slate-600", text: "Checking API…", icon: null },
    ready: {
      cls: "bg-emerald-50 text-emerald-700",
      text: "API connected, model loaded",
      icon: <CheckCircle2 size={12} />,
    },
    degraded: {
      cls: "bg-amber-50 text-amber-800",
      text: "API reachable, but the model checkpoint is not loaded",
      icon: <XCircle size={12} />,
    },
    offline: {
      cls: "bg-red-50 text-red-700",
      text: `API offline (${API_URL}). Start the backend first.`,
      icon: <XCircle size={12} />,
    },
  }[state];

  return (
    <div
      className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${map.cls}`}
    >
      {map.icon}
      {map.text}
    </div>
  );
}
