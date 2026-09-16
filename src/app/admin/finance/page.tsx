"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminGate from "@/app/admin/admin-gate";
import { getBookingRequests, getFinanceForBooking, saveFinanceRecord, type BookingRequestRecord, type FinanceRecord } from "@/lib/firebase/data";

function blankFinance(bookingId: string): FinanceRecord { return { id: crypto.randomUUID(), bookingId, quotedAmount: 0, discountAmount: 0, depositRequired: 0, amountPaid: 0, paymentStatus: "Unpaid", paymentMethod: "", paymentReference: "", invoiceStatus: "Not issued", updatedAt: new Date().toISOString() }; }

export default function FinancePage() {
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [finance, setFinance] = useState<FinanceRecord | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => { void getBookingRequests().then(setBookings).catch(() => setNotice("Bookings could not be loaded.")); }, []);
  useEffect(() => {
    if (!selectedId) { setFinance(null); return; }
    void getFinanceForBooking(selectedId).then((record) => setFinance(record ?? blankFinance(selectedId))).catch(() => setNotice("Financial record could not be loaded."));
  }, [selectedId]);

  const selected = bookings.find((item) => item.id === selectedId);
  const balance = useMemo(() => Math.max(0, (finance?.quotedAmount ?? 0) - (finance?.discountAmount ?? 0) - (finance?.amountPaid ?? 0)), [finance]);

  function update<K extends keyof FinanceRecord>(key: K, value: FinanceRecord[K]) { setFinance((current) => current ? { ...current, [key]: value } : current); }
  async function save() {
    if (!finance) return;
    const normalized = { ...finance, quotedAmount: Math.max(0, finance.quotedAmount), discountAmount: Math.max(0, finance.discountAmount), depositRequired: Math.max(0, finance.depositRequired), amountPaid: Math.max(0, finance.amountPaid), updatedAt: new Date().toISOString() };
    try { await saveFinanceRecord(normalized); setFinance(normalized); setNotice("Financial record saved to Firebase."); }
    catch { setNotice("Financial record could not be saved."); }
  }

  return <AdminGate><main className="adminPage"><div className="adminShell">
    <header className="adminHeader"><div><span className="kicker">Avram Kids · Finance</span><h1>Booking finances</h1><p>Simple booking-linked money tracking — quote, discount, deposit, paid and balance.</p></div><Link href="/admin" className="button buttonLight">Back to Operations</Link></header>
    {notice && <div className="adminToast" role="status" aria-live="polite">{notice}</div>}
    <section className="adminContent twoColumn">
      <div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Bookings</span><h2>Select a booking</h2></div><span>{bookings.length} total</span></div><div className="requestList">{bookings.map((item) => <button key={item.id} className={`requestRow ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}><div><strong>{item.name}</strong><span>{item.equipment} × {item.quantity}</span></div><div><strong>{item.date}</strong><span>{item.status}</span></div></button>)}</div></div>
      <div className="adminPanel">{finance && selected ? <><div className="panelHeading"><div><span className="kicker">Financial record</span><h2>{selected.name}</h2><p>{selected.date} · {selected.equipment} × {selected.quantity}</p></div></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void save(); }}><label>Quoted amount (P)<input type="number" min="0" step="1" value={finance.quotedAmount} onChange={(event) => update("quotedAmount", Number(event.target.value))} /></label><label>Approved discount (P)<input type="number" min="0" step="1" value={finance.discountAmount} onChange={(event) => update("discountAmount", Number(event.target.value))} /></label><label>Deposit required (P)<input type="number" min="0" step="1" value={finance.depositRequired} onChange={(event) => update("depositRequired", Number(event.target.value))} /></label><label>Amount paid (P)<input type="number" min="0" step="1" value={finance.amountPaid} onChange={(event) => update("amountPaid", Number(event.target.value))} /></label><label>Payment status<select value={finance.paymentStatus} onChange={(event) => update("paymentStatus", event.target.value as FinanceRecord["paymentStatus"])}><option>Unpaid</option><option>Deposit paid</option><option>Part paid</option><option>Paid</option></select></label><label>Payment method<input value={finance.paymentMethod ?? ""} onChange={(event) => update("paymentMethod", event.target.value)} placeholder="Cash, EFT, mobile money..." /></label><label>Payment reference<input value={finance.paymentReference ?? ""} onChange={(event) => update("paymentReference", event.target.value)} /></label><label>Invoice status<select value={finance.invoiceStatus} onChange={(event) => update("invoiceStatus", event.target.value as FinanceRecord["invoiceStatus"])}><option>Not issued</option><option>Draft</option><option>Issued</option><option>Paid</option></select></label><div className="adminStats"><article><span>Net due</span><strong>P{Math.max(0, finance.quotedAmount - finance.discountAmount)}</strong></article><article><span>Balance</span><strong>P{balance}</strong></article></div><button className="button buttonPrimary" type="submit">Save financial record</button></form></> : <div className="emptyState"><div>💰</div><h3>Select a booking</h3><p>Finance stays attached to the booking. No separate disconnected ledger.</p></div>}</div>
    </section>
  </div></main></AdminGate>;
}
