import Link from "next/link";
import { Heart, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-white">
              <Heart size={14} fill="currentColor" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                CardioSense
              </div>
              <div className="text-xs text-slate-500">
                AI-assisted arrhythmia screening
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link href="/predict" className="text-slate-600 hover:text-slate-900">
              Analyze
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900">
              About
            </Link>
            <a
              href="https://github.com/SahilInstinct/Heart-arrhythmia-detection-deployed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-500">
            <strong className="text-slate-700">Disclaimer:</strong> CardioSense is
            a research/demo tool and not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult a qualified clinician.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} CardioSense Demo UI. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
