"use client";

import { useMemo, useState } from "react";

function errorDetails(error: Error & { digest?: string }, reset: () => void) {
  const digest = error.digest ? `\nDigest: ${error.digest}` : "";
  return `Translend application error\n${error.message || "Unknown application error"}${digest}\nTime: ${new Date().toISOString()}`;
}

export default function AppErrorFallback({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);
  const details = useMemo(() => errorDetails(error, reset), [error, reset]);

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <section className="panel w-full max-w-2xl">
        <span className="badge orange">APPLICATION ISSUE</span>
        <h1 className="page-title mt-4">Something did not complete</h1>
        <p className="section-sub mt-2">
          Translend could not finish this screen or action. Your business data has not been intentionally replaced with demo data.
        </p>
        <div className="notice mt-5" style={{ borderColor: "#F3C3C3", background: "var(--red-100)", color: "#902323" }}>
          <strong>What to do:</strong> try again once. If it still fails, send the technical details to your Translend developer or workspace administrator so they can investigate the responsible feature.
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer font-semibold">Show technical details</summary>
          <pre className="mt-3 overflow-auto rounded-lg border bg-white p-4 text-xs whitespace-pre-wrap">{details}</pre>
        </details>
        <div className="form-actions mt-6">
          <button className="btn-primary" onClick={reset}>Try again</button>
          <button className="btn-secondary" onClick={copyDetails}>{copied ? "Copied" : "Copy report details"}</button>
        </div>
      </section>
    </main>
  );
}
