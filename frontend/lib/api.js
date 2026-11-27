// Real backend client for the MSHAN FastAPI service (app/main.py).
//   GET  /health   -> { status, model_loaded, num_classes, classes }
//   POST /explain  -> { predicted_class, class_name, confidence, probabilities,
//                       attribution_values, attribution_method, baseline_time_index }
// The model classifies ONE heartbeat: exactly 360 samples @ 360 Hz, R-peak at index 180.

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export const WINDOW_SIZE = 360;

// Display metadata per MIT-BIH class code. The backend only returns the code
// and a name; risk level / description / recommendation live here.
export const CLASS_META = {
  N: {
    name: "Normal Sinus Rhythm",
    risk: "low",
    description:
      "A normal heartbeat with regular morphology originating from the sinus node.",
    recommendation:
      "No concern detected from this beat. Maintain routine cardiovascular check-ups.",
  },
  L: {
    name: "Left Bundle Branch Block Beat (LBBB)",
    risk: "moderate",
    description:
      "Delayed activation of the left ventricle, producing a widened QRS complex.",
    recommendation:
      "Discuss with a clinician, especially if this pattern is persistent or new.",
  },
  R: {
    name: "Right Bundle Branch Block Beat (RBBB)",
    risk: "moderate",
    description:
      "Delayed activation of the right ventricle, producing a widened QRS complex.",
    recommendation:
      "Often benign, but a clinician should review it, particularly if new or symptomatic.",
  },
  A: {
    name: "Atrial Premature Contraction (APC)",
    risk: "moderate",
    description:
      "An early beat originating in the atria rather than the sinus node.",
    recommendation:
      "Usually benign when occasional. Review with a clinician if frequent or symptomatic.",
  },
  V: {
    name: "Premature Ventricular Contraction (PVC)",
    risk: "high",
    description:
      "An early beat originating in the ventricles, typically with a wide, abnormal QRS.",
    recommendation:
      "Consider clinical review, especially if frequent, repetitive, or symptomatic.",
  },
};

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}

function errorMessage(body, status) {
  const d = body?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d.length)
    return d.map((x) => x.msg || JSON.stringify(x)).join("; ");
  return `Request failed (${status})`;
}

// Sends one 360-sample beat to /explain and maps the response to the shape
// the result page renders.
export async function predictBeat(signal, meta = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signal }),
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL}. Is the backend running?`,
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(errorMessage(body, res.status));
  }
  const d = await res.json();
  const meta_ = CLASS_META[d.predicted_class] || {
    name: d.class_name,
    risk: "moderate",
    description: "",
    recommendation: "Please consult a clinician.",
  };

  return {
    classKey: d.predicted_class,
    className: d.class_name || meta_.name,
    confidence: d.confidence,
    riskLevel: meta_.risk,
    description: meta_.description,
    recommendation: meta_.recommendation,
    probabilities: Object.fromEntries(
      Object.entries(d.probabilities).map(([k, v]) => [
        k,
        { name: CLASS_META[k]?.name || k, value: v },
      ]),
    ),
    signal,
    attribution: d.attribution_values,
    attributionMethod: d.attribution_method,
    source: meta.source || "upload",
    fileName: meta.fileName || null,
    timestamp: new Date().toISOString(),
  };
}

// ---- Input parsing (runs in the browser) -------------------------------

function isBlank(line) {
  return line.trim() === "";
}

export async function parseBeatFile(file) {
  const text = await file.text();
  const lower = file.name.toLowerCase();

  let values;
  if (lower.endsWith(".json")) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("File is not valid JSON.");
    }
    values = Array.isArray(parsed) ? parsed : parsed?.signal;
    if (!Array.isArray(values))
      throw new Error('JSON must be an object with a "signal" array.');
  } else {
    let lines = text.split(/\r?\n/).filter((l) => !isBlank(l));
    // Drop a header row if the first line has no numeric cell at all.
    if (lines.length > 1) {
      const first = lines[0].split(/[,;\t ]+/).filter(Boolean);
      if (first.length && first.every((t) => Number.isNaN(Number(t))))
        lines = lines.slice(1);
    }
    values = lines
      .join(",")
      .split(/[,;\s]+/)
      .filter(Boolean)
      .map(Number);
  }

  values = values.map((v) => (typeof v === "number" ? v : Number(v)));
  if (values.some((v) => !Number.isFinite(v)))
    throw new Error(
      "The file contains non-numeric or missing values. Use only numeric amplitudes.",
    );
  if (values.length !== WINDOW_SIZE)
    throw new Error(
      `Expected exactly ${WINDOW_SIZE} samples (one heartbeat), found ${values.length}.`,
    );
  return values;
}

// Synthetic demo waveform (NOT a real recording) so the pipeline can be
// tried without a file. R-peak is placed at index 180 like the training data.
export function demoBeat() {
  const g = (x, mu, sigma, amp) =>
    amp * Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
  return Array.from({ length: WINDOW_SIZE }, (_, i) => {
    const v =
      g(i, 110, 12, 0.12) + // P wave
      g(i, 170, 3, -0.15) + // Q
      g(i, 180, 4, 1.0) + // R
      g(i, 190, 4, -0.25) + // S
      g(i, 255, 20, 0.3); // T wave
    return Number(v.toFixed(5));
  });
}
