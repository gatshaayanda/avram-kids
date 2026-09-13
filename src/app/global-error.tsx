"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const details = `Translend global application error\n${error.message || "Unknown application error"}${error.digest ? `\nDigest: ${error.digest}` : ""}\nTime: ${new Date().toISOString()}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(details); } catch { /* keep recovery available even when clipboard is unavailable */ }
  };

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f8fafc", color: "#172033" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "100%", maxWidth: 680, background: "white", border: "1px solid #d9dee8", borderRadius: 16, padding: 28, boxSizing: "border-box" }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".08em", margin: 0 }}>APPLICATION ISSUE</p>
            <h1 style={{ fontSize: 28, margin: "12px 0 8px" }}>Translend needs to recover</h1>
            <p style={{ lineHeight: 1.6, color: "#596579" }}>The application could not complete this request. Try again. If the problem remains, report the details below to the Translend developer or workspace administrator.</p>
            <pre style={{ whiteSpace: "pre-wrap", overflow: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, fontSize: 12 }}>{details}</pre>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button onClick={() => reset()} style={{ padding: "10px 16px", border: 0, borderRadius: 9, background: "#172033", color: "white", fontWeight: 700, cursor: "pointer" }}>Try again</button>
              <button onClick={copy} style={{ padding: "10px 16px", border: "1px solid #cbd5e1", borderRadius: 9, background: "white", fontWeight: 700, cursor: "pointer" }}>Copy report details</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
