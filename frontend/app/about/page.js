import Link from "next/link";
import { HeartPulse, GitBranch, Database, Cpu, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
        <HeartPulse size={14} />
        About the project
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        How CardioSense works
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        A short overview of the model, data, and current build status.
      </p>

      <div className="mt-10 space-y-6">
        <Card
          icon={<Cpu size={18} />}
          title="The model"
          text="MSHAN, a Multi-Scale Hybrid Attention Network combining 1D convolutions, temporal and channel attention, and stacked GRUs. It classifies one 360-sample heartbeat into five MIT-BIH classes: N, L, R, A and V. It does not diagnose conditions such as atrial fibrillation."
        />
        <Card
          icon={<Database size={18} />}
          title="Training data"
          text="Trained on the MIT-BIH Arrhythmia Database (PhysioNet). Beats are 360-sample windows around annotated R-peaks, MLII lead, sampled at 360 Hz, with per-beat z-score normalization."
        />
        <Card
          icon={<GitBranch size={18} />}
          title="How this app works"
          text="This Next.js UI parses your uploaded beat in the browser and sends it to a FastAPI backend (POST /explain). The backend returns the predicted class, class probabilities, and an input-times-gradient attribution that the result page plots over the waveform."
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href="/predict" className="btn-primary">
          Try the analyzer
          <ArrowRight size={16} />
        </Link>
        <a
          href="https://github.com/Akarsh-Coding/Heart-arrhythmia-detection-deployed"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          View backend repo
        </a>
      </div>
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1.5 text-sm text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}
