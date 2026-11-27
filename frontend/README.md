# CardioSense — Heart Arrhythmia Detection UI

A demo Next.js (JavaScript) frontend for the
[Heart-arrhythmia-detection-deployed](https://github.com/SahilInstinct/Heart-arrhythmia-detection-deployed)
project. Styled with Tailwind CSS. Uses a mock prediction service so the full
flow works today while the real backend is being finalized.

## Pages

- **`/`** — Landing/home page: hero, features, supported classes, how it works.
- **`/predict`** — Data input form (manual entry *or* ECG file upload).
- **`/result`** — Prediction output with class, confidence, probabilities,
  risk level, recommended next steps, input summary, and JSON report download.
- **`/about`** — Project overview + instructions to wire up the real API.

## Getting started

```bash
# install
npm install

# dev
npm run dev
# -> http://localhost:3000

# production build
npm run build
npm start
```

Requires Node 18.17+.

## Wiring up the real backend

The prediction call lives in [`lib/mockApi.js`](./lib/mockApi.js). Replace its
body with a real `fetch` once the backend endpoint is ready:

```js
export async function predictArrhythmia(input) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}
```

For the ECG upload mode, swap the JSON body for `FormData` carrying the file.

### Expected response shape

```json
{
  "classKey": "AFIB",
  "className": "Atrial Fibrillation",
  "confidence": 0.87,
  "riskLevel": "high",
  "description": "…",
  "recommendation": "…",
  "probabilities": {
    "N":    { "name": "Normal Sinus Rhythm",            "value": 0.05 },
    "AFIB": { "name": "Atrial Fibrillation",            "value": 0.87 },
    "VT":   { "name": "Ventricular Tachycardia",        "value": 0.02 },
    "PVC":  { "name": "Premature Ventricular Contraction","value": 0.04 },
    "BRADY":{ "name": "Sinus Bradycardia",              "value": 0.02 }
  },
  "timestamp": "2026-11-14T12:34:56.000Z"
}
```

If the backend uses different class keys or a different field layout, update
`lib/mockApi.js` and the result page (`app/result/page.js`) accordingly — both
are small, self-contained files.

## Tech

- **Next.js 14** (App Router) + JavaScript
- **Tailwind CSS** for styling
- **lucide-react** for icons

## Project structure

```
app/
  layout.js        # root layout (Navbar + Footer)
  page.js          # landing page
  predict/page.js  # input form
  result/page.js   # prediction output
  about/page.js    # project info
  globals.css      # Tailwind base + utility classes

components/
  Navbar.js
  Footer.js
  EcgWave.js       # animated ECG illustration

lib/
  mockApi.js       # mock prediction service — replace with real fetch
```

## Disclaimer

This UI is for research and demo purposes only. It is not a medical device and
must not be used to diagnose or treat patients.
