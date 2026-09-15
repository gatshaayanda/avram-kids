import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link></div></nav>
      <div className="formWrap"><div className="formCard"><div className="confirm"><div className="confirmIcon">📶</div><h1>You&apos;re offline</h1><p>The Avram Kids app is still available for the pages and data already saved on this device.</p><p>Reconnect to load the latest catalogue and send changes that require the internet.</p><div className="actions" style={{justifyContent:"center"}}><Link className="button buttonPrimary" href="/">Open Avram Kids</Link><Link className="button buttonLight" href="/book">Open booking</Link></div></div></div></div>
    </main>
  );
}
