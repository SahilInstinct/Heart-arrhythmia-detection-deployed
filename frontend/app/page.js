import Link from "next/link";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Upload,
  LineChart,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import EcgWave from "@/components/EcgWave";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-700 shadow-sm">
                <HeartPulse size={14} />
                AI-Powered Cardiac Screening
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Detect heart <span className="gradient-text">arrhythmias</span>{" "}
                in seconds
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Upload a single segmented ECG heartbeat and let our deep-learning
                model (MSHAN) classify it, with an explanation of which parts of
                the waveform drove the result.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/predict" className="btn-primary">
                  Start Analysis
                  <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn-secondary">
                  How it works
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-primary-100 pt-6">
                <Stat value="5" label="Rhythm classes" />
                <Stat value="< 2s" label="Inference time" />
                <Stat value="94%" label="Model accuracy*" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                *Reported on MIT-BIH benchmark during model development.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Live Monitor
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Lead II
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-primary-50/50 p-2">
                  <EcgWave className="h-32 w-full" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <Metric label="HR" value="78" unit="bpm" />
                  <Metric label="PR" value="160" unit="ms" />
                  <Metric label="QRS" value="92" unit="ms" />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-200/40 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-primary-400/30 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for clinical workflows
          </h2>
          <p className="mt-3 text-slate-600">
            Fast, interpretable predictions with the context clinicians need to
            act.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Upload size={20} />}
            title="Flexible input"
            text="Upload one 360-sample heartbeat (MLII, 360 Hz) as a CSV, TXT, or JSON file."
          />
          <Feature
            icon={<Activity size={20} />}
            title="Multi-class detection"
            text="Classifies a beat as Normal, LBBB, RBBB, Atrial premature, or Ventricular premature."
          />
          <Feature
            icon={<LineChart size={20} />}
            title="Transparent results"
            text="See per-class probabilities and a waveform with the influential samples highlighted."
          />
          <Feature
            icon={<ShieldCheck size={20} />}
            title="Privacy-first"
            text="Your inputs stay in your session. No PHI is stored on our servers."
          />
          <Feature
            icon={<Stethoscope size={20} />}
            title="Clinician-friendly"
            text="Designed for triage support — not a replacement for a cardiologist's judgment."
          />
          <Feature
            icon={<HeartPulse size={20} />}
            title="Validated model"
            text="Trained on the MIT-BIH arrhythmia database and validated on hold-out test sets."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-slate-600">
              Three simple steps, from input to actionable insight.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              step="01"
              title="Enter data"
              text="Upload a segmented heartbeat file with 360 samples, R-peak at index 180."
            />
            <Step
              step="02"
              title="Run analysis"
              text="The backend normalizes the beat and the model computes probabilities across five classes."
            />
            <Step
              step="03"
              title="Review results"
              text="See the predicted class, confidence, risk level, and recommended next steps."
            />
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/predict" className="btn-primary">
              Try it now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Supported classes */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Heartbeat types we classify
            </h2>
            <p className="mt-3 text-slate-600">
              The model is trained on the MIT-BIH Arrhythmia Database to
              distinguish five heartbeat classes.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Normal beat (N)",
                "Left bundle branch block beat (L)",
                "Right bundle branch block beat (R)",
                "Atrial premature beat (A)",
                "Premature ventricular contraction (V)",
              ].map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-primary-600"
                    strokeWidth={2.5}
                  />
                  <span className="text-slate-700">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary-50 to-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-white">
                <HeartPulse size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Ready to try it?
                </div>
                <div className="text-xs text-slate-500">
                  Needs the FastAPI backend running.
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-700">
              This UI sends your heartbeat to the MSHAN FastAPI backend (set{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                NEXT_PUBLIC_API_URL
              </code>
              ) and shows the model's real prediction.
            </p>
            <Link href="/predict" className="btn-primary mt-6 w-full">
              Open the analyzer
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-slate-900">
        {value}
        <span className="ml-1 text-xs font-medium text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="card transition hover:shadow-md">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Step({ step, title, text }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-semibold tracking-widest text-primary-600">
        STEP {step}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{text}</p>
    </div>
  );
}
