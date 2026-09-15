"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/client";
import { getBookingRequests, getEquipment, saveEquipmentRecord, deleteEquipmentRecord, seedEquipmentRecords, updateBookingStatus, clearBookingRequests, type BookingRequestRecord } from "@/lib/firebase/data";
import { saveEquipment, seedEquipment, type EquipmentItem } from "@/lib/equipment";
import AdminGate from "@/app/admin/admin-gate";

type Special = { id: string; title: string; detail: string; active: boolean };
const SPECIALS_KEY = "avram_specials_v1";
function loadSpecials(): Special[] { try { return JSON.parse(localStorage.getItem(SPECIALS_KEY) ?? "[]"); } catch { return []; } }
function isCompleteLead(item: BookingRequestRecord) { return Boolean(item.name && item.phone && item.date && item.startTime && item.location && item.equipment && item.quantity > 0 && item.guests && item.eventType); }

export default function AdminPage() {
  const [tab, setTab] = useState<"requests" | "equipment" | "specials">("requests");
  const [bookings, setBookings] = useState<BookingRequestRecord[]>([]); const [equipment, setEquipment] = useState<EquipmentItem[]>([]); const [specials, setSpecials] = useState<Special[]>([]);
  const [selected, setSelected] = useState<string | null>(null); const [filter, setFilter] = useState<"all" | "new" | "upcoming">("all");
  const [specialTitle, setSpecialTitle] = useState(""); const [specialDetail, setSpecialDetail] = useState(""); const [editingId, setEditingId] = useState<string | null>(null); const [draft, setDraft] = useState<EquipmentItem | null>(null); const [imageFile, setImageFile] = useState<File | null>(null); const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getBookingRequests(), getEquipment()]).then(async ([remoteBookings, remoteEquipment]) => {
      if (cancelled) return;
      setBookings(remoteBookings);
      if (remoteEquipment.length) setEquipment(remoteEquipment);
      else {
        await seedEquipmentRecords(seedEquipment);
        if (!cancelled) setEquipment(seedEquipment);
      }
      setSpecials(loadSpecials());
    }).catch(() => {
      if (!cancelled) setNotice("Operations data could not be loaded. Check the Firebase connection and access settings.");
    });
    return () => { cancelled = true; };
  }, []);

  const counts = useMemo(() => ({ total: bookings.length, new: bookings.filter((item) => item.status === "New").length, qualified: bookings.filter(isCompleteLead).length, upcoming: bookings.filter((item) => item.date >= new Date().toISOString().slice(0, 10) && item.status !== "Cancelled").length }), [bookings]);
  const visibleBookings = useMemo(() => { const filtered = bookings.filter((item) => filter === "new" ? item.status === "New" : filter === "upcoming" ? item.date >= new Date().toISOString().slice(0, 10) && item.status !== "Cancelled" : true); return [...filtered].sort((a, b) => a.date.localeCompare(b.date) || b.createdAt.localeCompare(a.createdAt)); }, [bookings, filter]);

  async function updateStatus(id: string, status: BookingRequestRecord["status"]) {
    try { await updateBookingStatus(id, status); setBookings((current) => current.map((item) => item.id === id ? { ...item, status } : item)); setNotice(`Booking marked ${status.toLowerCase()}.`); }
    catch { setNotice("The booking status could not be updated. Please try again."); }
  }

  async function saveEquipmentItem() {
    if (!draft?.name.trim() || !draft.size.trim() || !draft.price.trim()) return;
    let nextDraft = draft;
    if (imageFile) {
      if (!auth.currentUser) { setNotice("Please sign in again before changing an image."); return; }
      try {
        const safeName = imageFile.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
        const imageRef = ref(storage, `equipment/${draft.id}/${Date.now()}-${safeName}`);
        const result = await uploadBytes(imageRef, imageFile, { contentType: imageFile.type });
        nextDraft = { ...draft, imageUrl: await getDownloadURL(result.ref) };
      } catch { setNotice("The image could not be uploaded. Please try again."); return; }
    }
    try {
      await saveEquipmentRecord(nextDraft);
      const next = equipment.some((item) => item.id === nextDraft.id) ? equipment.map((item) => item.id === nextDraft.id ? nextDraft : item) : [...equipment, nextDraft];
      setEquipment(next); saveEquipment(next); setEditingId(null); setDraft(null); setImageFile(null); setNotice("Equipment saved. Customers can now see the updated listing.");
    } catch { setNotice("The equipment could not be saved. Please try again."); }
  }

  function startEdit(item: EquipmentItem) { setEditingId(item.id); setDraft({ ...item }); setImageFile(null); }
  function startAdd() { setEditingId("new"); setDraft({ id: crypto.randomUUID(), name: "", detail: "", size: "", price: "P0", imageUrl: "", active: true }); setImageFile(null); }
  async function deleteEquipment(id: string) { const item = equipment.find((entry) => entry.id === id); if (!item || !window.confirm(`Remove “${item.name}” from the equipment list?`)) return; try { await deleteEquipmentRecord(id); const next = equipment.filter((entry) => entry.id !== id); setEquipment(next); saveEquipment(next); setNotice("Equipment removed."); } catch { setNotice("The equipment could not be removed. Please try again."); } }
  async function toggleEquipment(id: string) { const item = equipment.find((entry) => entry.id === id); if (!item) return; const nextItem = { ...item, active: !item.active }; try { await saveEquipmentRecord(nextItem); const next = equipment.map((entry) => entry.id === id ? nextItem : entry); setEquipment(next); saveEquipment(next); setNotice(nextItem.active ? "Equipment is now visible to customers." : "Equipment is now hidden from customers."); } catch { setNotice("The visibility change could not be saved."); } }
  async function resetCatalogue() { if (!window.confirm("Restore the original Avram equipment list? Your catalogue changes will be removed.")) return; try { await seedEquipmentRecords(seedEquipment); setEquipment(seedEquipment); saveEquipment(seedEquipment); setNotice("Original equipment list restored."); } catch { setNotice("The original list could not be restored."); } }
  function addSpecial(event: React.FormEvent) { event.preventDefault(); if (!specialTitle.trim()) return; const next = [...specials, { id: crypto.randomUUID(), title: specialTitle.trim(), detail: specialDetail.trim(), active: true }]; setSpecials(next); localStorage.setItem(SPECIALS_KEY, JSON.stringify(next)); setSpecialTitle(""); setSpecialDetail(""); setNotice("Special saved."); }
  function toggleSpecial(id: string) { const next = specials.map((item) => item.id === id ? { ...item, active: !item.active } : item); setSpecials(next); localStorage.setItem(SPECIALS_KEY, JSON.stringify(next)); }
  function deleteSpecial(id: string) { const next = specials.filter((item) => item.id !== id); setSpecials(next); localStorage.setItem(SPECIALS_KEY, JSON.stringify(next)); }
  async function clearRequests() { if (!window.confirm("Clear all booking requests? This removes them from the shared Operations queue.")) return; try { await clearBookingRequests(); setBookings([]); setSelected(null); setNotice("Booking requests cleared."); } catch { setNotice("The requests could not be cleared."); } }
  const current = bookings.find((item) => item.id === selected) ?? null;

  return <AdminGate><main className="adminPage"><div className="adminShell">
    <header className="adminHeader"><div><span className="kicker">Avram Kids · Operations</span><h1>Operations dashboard</h1><p>Keep every booking request and equipment listing organized in one simple place.</p></div><div className="adminHeaderActions"><Link href="/" className="button buttonLight">View public site</Link><button className="button buttonLight" onClick={() => void clearRequests()}>Clear requests</button></div></header>
    <section className="adminStats"><article><span>Total requests</span><strong>{counts.total}</strong></article><article><span>New</span><strong>{counts.new}</strong></article><article><span>Ready to review</span><strong>{counts.qualified}</strong></article><article><span>Upcoming</span><strong>{counts.upcoming}</strong></article></section>
    <nav className="adminTabs" aria-label="Operations sections"><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Booking requests</button><button className={tab === "equipment" ? "active" : ""} onClick={() => setTab("equipment")}>Equipment</button><button className={tab === "specials" ? "active" : ""} onClick={() => setTab("specials")}>Specials</button></nav>
    {notice && <div className="adminToast" role="status">{notice}</div>}
    {tab === "requests" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Owner queue</span><h2>Booking requests</h2></div><span>{bookings.length} total</span></div><div className="adminFilters"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button><button className={filter === "new" ? "active" : ""} onClick={() => setFilter("new")}>Needs review ({counts.new})</button><button className={filter === "upcoming" ? "active" : ""} onClick={() => setFilter("upcoming")}>Upcoming ({counts.upcoming})</button></div>{visibleBookings.length === 0 ? <div className="emptyState"><div>📋</div><h3>No requests in this view</h3><p>Customers can submit complete booking requests through the public booking page.</p><Link href="/book" className="button buttonPrimary">Open booking page</Link></div> : <div className="requestList">{visibleBookings.map((item) => <button key={item.id} className={`requestRow ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}><div><strong>{item.name}</strong><span>{item.equipment} × {item.quantity}</span></div><div><strong>{item.date}</strong><span>{isCompleteLead(item) ? "Ready to review" : item.status}</span></div></button>)}</div>}</div><div className="adminPanel detailPanel">{current ? <><div className="panelHeading"><div><span className="kicker">Request details</span><h2>{current.name}</h2></div><select value={current.status} onChange={(event) => void updateStatus(current.id, event.target.value as BookingRequestRecord["status"])}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div><dl className="detailList"><div><dt>Event</dt><dd>{current.date} · {current.startTime || "Time not specified"} · {current.eventType || "Not specified"}</dd></div><div><dt>Guests</dt><dd>{current.guests || "Not specified"}</dd></div><div><dt>Equipment</dt><dd>{current.equipment} × {current.quantity}</dd></div><div><dt>Location</dt><dd>{current.location}</dd></div><div><dt>Phone</dt><dd><a href={`tel:${current.phone}`}>{current.phone}</a></dd></div><div><dt>Email</dt><dd>{current.email || "Not provided"}</dd></div><div><dt>Notes</dt><dd>{current.notes || "No additional notes."}</dd></div></dl><div className="actions"><a className="button buttonPrimary" href={`https://wa.me/${current.phone.replace(/\D/g, "")}`}>Contact on WhatsApp</a><a className="button buttonLight" href={`tel:${current.phone}`}>Call</a></div></> : <div className="emptyState"><div>👈</div><h3>Select a request</h3><p>Choose a request to see the complete event brief, then contact the customer only when you are ready.</p></div>}</div></section>}
    {tab === "equipment" && <section className="adminContent"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">What customers can book</span><h2>Equipment</h2><p>Add, edit, hide or remove items from your equipment list.</p></div><div className="actions"><button className="button buttonPrimary" onClick={startAdd}>+ Add equipment</button><button className="button buttonLight" onClick={() => void resetCatalogue()}>Restore original list</button></div></div><div className="equipmentAdminGrid">{equipment.map((item) => <article key={item.id}><div>{item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 10 }} /> : null}<strong>{item.name}</strong><span>{item.detail} · {item.size}</span></div><b>{item.price}</b><span>{item.active ? "Visible" : "Hidden"}</span><div className="actions"><button className="button buttonLight" onClick={() => void toggleEquipment(item.id)}>{item.active ? "Hide" : "Show"}</button><button className="button buttonLight" onClick={() => startEdit(item)}>Edit</button><button className="button buttonLight" onClick={() => void deleteEquipment(item.id)}>Delete</button></div></article>)}</div></div>{draft && <div className="adminPanel"><div className="panelHeading"><div><span className="kicker">{editingId === "new" ? "New listing" : "Edit listing"}</span><h2>{editingId === "new" ? "Add equipment" : "Edit equipment"}</h2><p>Use simple, customer-friendly wording for the name, size and price.</p></div><button className="button buttonLight" onClick={() => { setDraft(null); setEditingId(null); setImageFile(null); }}>Cancel</button></div><form className="adminForm" onSubmit={(event) => { event.preventDefault(); void saveEquipmentItem(); }}><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Blue Castle" required /></label><label>Description<input value={draft.detail} onChange={(event) => setDraft({ ...draft, detail: event.target.value })} placeholder="Short description" required /></label><label>Size<input value={draft.size} onChange={(event) => setDraft({ ...draft, size: event.target.value })} placeholder="e.g. 3 × 6 m" required /></label><label>Price<input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="e.g. P600" required /></label><label>Equipment image<input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />{draft.imageUrl && <span>Current image is set. Choose a new image to replace it.</span>}</label><label><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Show this equipment on the website</label><button className="button buttonPrimary" type="submit">Save equipment</button></form></div>}</section>}
    {tab === "specials" && <section className="adminContent twoColumn"><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Content</span><h2>Specials</h2></div><span>{specials.filter((item) => item.active).length} active</span></div>{specials.length === 0 ? <div className="emptyState"><div>✨</div><h3>No specials yet</h3><p>Add a special when there is a real offer you want customers to see.</p></div> : <div className="specialList">{specials.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.detail || "No detail added."}</p></div><div className="actions"><button className="button buttonLight" onClick={() => toggleSpecial(item.id)}>{item.active ? "Active" : "Hidden"}</button><button className="button buttonLight" onClick={() => deleteSpecial(item.id)}>Delete</button></div></article>)}</div>}</div><div className="adminPanel"><div className="panelHeading"><div><span className="kicker">Create</span><h2>Add a special</h2></div></div><form onSubmit={addSpecial} className="adminForm"><label>Title<input value={specialTitle} onChange={(event) => setSpecialTitle(event.target.value)} placeholder="e.g. Weekend package" required /></label><label>Detail<textarea value={specialDetail} onChange={(event) => setSpecialDetail(event.target.value)} placeholder="Describe the real offer." /></label><button className="button buttonPrimary" type="submit">Save special</button></form></div></section>}
  </div></main></AdminGate>;
}
