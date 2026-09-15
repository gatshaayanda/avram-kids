"use client";

import { useState } from "react";

export default function AppErrorFallback({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);
  const details = `${error.message || "Unknown application error"}${error.digest ? `\nDigest: ${error.digest}` : ""}\nTime: ${new Date().toISOString()}`;

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#fff8e7",fontFamily:"Arial, sans-serif",color:"#243047"}}>
      <section style={{width:"min(640px,100%)",background:"white",border:"1px solid #eadfce",borderRadius:24,padding:32}}>
        <strong style={{color:"#e95f3f",fontSize:13,letterSpacing:1}}>AVRAM KIDS</strong>
        <h1>Something did not complete</h1>
        <p>We could not finish this screen. Please try again. If the issue continues, the technical details below can help us investigate it.</p>
        <details><summary>Show technical details</summary><pre style={{whiteSpace:"pre-wrap",overflow:"auto",fontSize:12,background:"#f7f4ee",padding:16,borderRadius:12}}>{details}</pre></details>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}><button onClick={reset} style={{border:0,borderRadius:999,padding:"12px 18px",background:"#e95f3f",color:"white",fontWeight:800}}>Try again</button><button onClick={copyDetails} style={{border:"1px solid #eadfce",borderRadius:999,padding:"12px 18px",background:"white",fontWeight:800}}>{copied ? "Copied" : "Copy details"}</button></div>
      </section>
    </main>
  );
}
