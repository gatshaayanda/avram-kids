"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BookingRequest = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  location: string;
  equipment: string;
  quantity: number;
  eventType: string;
  notes: string;
  status: "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";
};

type Special = { id: string; title: string; detail: string; active: boolean };

const BOOKINGS_KEY = "avram_booking_requests_v1";
const SPECIALS_KEY = "avram_specials_v1";

const equipment = [
  ["Castle with Slide", "3 × 7 m", "P850"],
  ["Curved Water Slide with Pool", "3 × 7 m", "P850"],
  ["Tropical Castle with Slide", "3 × 5.5 m", "P700"],
  ["Tropical Slip 'n Slide with Pool", "3 × 6 m", "P600"],
  ["Square Tropical Jumping Castle", "4.5 × 4.5 m", "P600"],
  ["Tall Dual-Lane Water Slide", "3 × 6 × 2.5 m", "P1,000"],
  ["Long Dual-Lane Slip 'n Slide", "2 × 8 m", "P650"],
  ["Tropical Castle & Slide Combo", "3 × 6 m", "P600"],
  ["Classic Open Jumping Castle", "3 × 3 m", "P500"],
  ["Tropical Castle Combo", "3 × 5.5 m", "P700"],
  ["Dual-Lane Slip 'n Slide", "3.3 × 8 m", "P900"],
];

function loadBookings(): BookingRequest[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function loadSpecials(): Special[] {
  try {
    return JSON.parse(localStorage.getItem(SPECIALS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const [tab, setTab] = useState<"requests" | "equipment" | "specials">("requests");
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [specialTitle, setSpecialTitle] = useState("");
  const [specialDetail, setSpecialDetail] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setBookings(loadBookings());
    setSpecials(loadSpecials());
  }, []);

  const counts = useMemo(() => ({
    total: bookings.length,
    new: bookings.filter((item) => item.status === "New").length,
    confirmed: bookings.filter((item) => item.status === "Confirmed").length,
    upcoming: bookings.filter((item) => item.date >= new Date().toISOString().slice(0, 10) && item.status !== "Cancelled").length,
  }), [bookings]);

  function updateStatus(id: string, status: BookingRequest["status"]) {
    const next = bookings.map((item) => item.id === id ? { ...item, status } : item);
    setBookings(next);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
    setNotice(`Booking marked ${status.toLowerCase()}.`);
  }

  function addSpecial(event: React.FormEvent) {
    event.preventDefault();
    if (!specialTitle.trim()) return;
    const next = [...specials, { id: crypto.randomUUID(), title: specialTitle.trim(), detail: specialDetail.trim(), active: true }];
    setSpecials(next);
    localStorage.setItem(SPECIALS_KEY, JSON.stringify(next));
    setSpecialTitle("");
    setSpecialDetail("");
    setNotice("Special saved in this QA browser.");
  }

  function toggleSpecial(id: string) {
    const next = specials.map((item) => item.id === id ? { ...item, active: !item.active } : item);
    setSpecials(next);
    localStorage.setItem(SPECIALS_KEY, JSON.stringify(next));
  }

  function deleteSpecial(id: string) {
    const next = specials.filter((item) => item.id !== id);
    setSpecials(next);
    localStorage.setItem(SPECIALS_KEY, JSON.stringify(next));
  }

  function clearQaData() {
    localStorage.removeItem(BOOKINGS_KEY);
    localStorage.removeItem(SPECIALS_KEY);
    setBookings([]);
    setSpecials([]);
    setSelected(null);
    setNotice("QA browser data cleared.");
  }

  const current = bookings.find((item) => item.id === selected) ?? null;

  return (
    <main className="adminPage">
      <div className="adminShell">
        <header className="adminHeader">
          <div><span className="kicker">Avram Kids · Operations</span><h1>Admin dashboard</h1><p>QA-ready operations workspace. Authentication and shared Firebase data come next.</p></div>
          <div className="adminHeaderActions"><Link href="/" className="button buttonLight">View public site</Link><button className="button buttonLight" onClick={clearQaData}>Reset QA data</button></div>
        </header>

        <div className="adminNotice"><strong>QA mode:</strong> requests and specials are stored in this browser only. This deliberately avoids pretending that unauthenticated browser storage is production persistence.</div>

        <section className="adminStats">
          <article><span>Total requests</span><strong>{counts.total}</strong></article>
          <article><span>New</span><strong>{counts.new}</strong></article>
          <article><span>Confirmed</span><strong>{counts.confirmed}</strong></article>
          <article><span>Upcoming</span><strong>{counts.upcoming}</strong></article>
        </section>

        <nav className="adminTabs" aria-label="Admin sections">
          <button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Booking requests</button>
          <button className={tab === "equipment" ? "active" : ""} onClick={() => setTab("equipment")}>Equipment</button>
          <button className={tab === "specials" ? "active" : ""} onClick={() => setTab("specials")}>Specials</button>
        </nav>

        {notice && <div className="adminToast" role="status">{notice}</div>}

        {tab === "requests" && <section className="adminContent twoColumn">
          <div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Incoming work</span><h2>Booking requests</h2></div><span>{bookings.length} total</span></div>
            {bookings.length === 0 ? <div className="emptyState"><div>📋</div><h3>No booking requests yet</h3><p>Open the public booking form, submit a test request, then return here in the same browser.</p><Link href="/book" className="button buttonPrimary">Create QA booking</Link></div> : <div className="requestList">{bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((item) => <button key={item.id} className={`requestRow ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}><div><strong>{item.name}</strong><span>{item.equipment} × {item.quantity}</span></div><div><strong>{item.date}</strong><span>{item.status}</span></div></button>)}</div>}
          </div>
          <div className="adminPanel detailPanel">{current ? <><div className="panelHeading"><div><span className="kicker">Request detail</span><h2>{current.name}</h2></div><select value={current.status} onChange={(event) => updateStatus(current.id, event.target.value as BookingRequest["status"])}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div><dl className="detailList"><div><dt>Event</dt><dd>{current.date} · {current.eventType || "Not specified"}</dd></div><div><dt>Equipment</dt><dd>{current.equipment} × {current.quantity}</dd></div><div><dt>Location</dt><dd>{current.location}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${current.phone}`}>{current.phone}</a></dd></div><div><dt>Email</dt><dd>{current.email || "Not provided"}</dd></div><div><dt>Notes</dt><dd>{current.notes || "No additional notes."}</dd></div></dl><div className="actions"><a className="button buttonPrimary" href={`https://wa.me/${current.phone.replace(/\D/g, "")}`}>WhatsApp</a><a className="button buttonLight" href={`tel:${current.phone}`}>Call</a></div></> : <div className="emptyState"><div>👈</div><h3>Select a request</h3><p>Choose a booking request to inspect its event details and update its status.</p></div>}</div>
        </section>}

        {tab === "equipment" && <section className="adminContent"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Current catalogue</span><h2>Equipment</h2></div><span>11 listed items</span></div><div className="equipmentAdminGrid">{equipment.map(([name, size, price]) => <article key={name}><div><strong>{name}</strong><span>{size}</span></div><b>{price}</b><Link href={`/book?equipment=${encodeURIComponent(name)}`}>Open booking form →</Link></article>)}</div><p className="adminFootnote">The current catalogue is locked to the supplied Avram pricing. Editing real prices will be added when shared Firebase-backed catalogue management is introduced.</p></div></section>}

        {tab === "specials" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Content</span><h2>Specials</h2></div><span>{specials.filter((item) => item.active).length} active</span></div>{specials.length === 0 ? <div className="emptyState"><div>✨</div><h3>No specials yet</h3><p>Add a QA special below. It is stored locally until the shared content backend is connected.</p></div> : <div className="specialList">{specials.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.detail || "No detail added."}</p></div><div className="actions"><button className="button buttonLight" onClick={() => toggleSpecial(item.id)}>{item.active ? "Active" : "Hidden"}</button><button className="button buttonLight" onClick={() => deleteSpecial(item.id)}>Delete</button></div></article>)}</div>}</div><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Create</span><h2>Add a special</h2></div></div><form onSubmit={addSpecial} className="adminForm"><label>Title<input value={specialTitle} onChange={(event) => setSpecialTitle(event.target.value)} placeholder="e.g. Weekend package" required /></label><label>Detail<textarea value={specialDetail} onChange={(event) => setSpecialDetail(event.target.value)} placeholder="Describe the special without inventing a real price or availability." /></label><button className="button buttonPrimary" type="submit">Save special</button></form></div></section>}
      </div>
    </main>
  );
}
