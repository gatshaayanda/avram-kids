"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const details = `Avram Kids application error\n${error.message || "Unknown application error"}${error.digest ? `\nDigest: ${error.digest}` : ""}\nTime: ${new Date().toISOString()}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(details); } catch { /* recovery remains available */ }
  };

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#fff8e7", color: "#243047" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "100%", maxWidth: 680, background: "white", border: "1px solid #eadfce", borderRadius: 24, padding: 30, boxSizing: "border-box" }}>
            <strong style={{ fontSize: 12, letterSpacing: ".08em", color: "#e95f3f" }}>AVRAM KIDS</strong>
            <h1 style={{ fontSize: 30, margin: "12px 0 8px" }}>Avram needs to recover</h1>
            <p style={{ lineHeight: 1.6, color: "#667085" }}>The application could not complete this request. Try again. If the problem remains, the technical details below can help with investigation.</p>
            <pre style={{ whiteSpace: "pre-wrap", overflow: "auto", background: "#f7f4ee", border: "1px solid #eadfce", borderRadius: 12, padding: 14, fontSize: 12 }}>{details}</pre>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button onClick={() => reset()} style={{ padding: "11px 17px", border: 0, borderRadius: 999, background: "#243047", color: "white", fontWeight: 800, cursor: "pointer" }}>Try again</button>
              <button onClick={copy} style={{ padding: "11px 17px", border: "1px solid #eadfce", borderRadius: 999, background: "white", fontWeight: 800, cursor: "pointer" }}>Copy report details</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
