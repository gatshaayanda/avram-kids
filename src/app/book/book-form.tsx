"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getEquipment, createBookingRequest } from "@/lib/firebase/data";
import { readEquipment, type EquipmentItem } from "@/lib/equipment";

export default function BookForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("equipment") ?? "";
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getEquipment().then((items) => {
      if (!cancelled && items.length) setEquipment(items.filter((item) => item.active));
      else if (!cancelled) setEquipment(readEquipment().filter((item) => item.active));
    }).catch(() => {
      if (!cancelled) setEquipment(readEquipment().filter((item) => item.active));
    });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const request = {
      createdAt: new Date().toISOString(),
      name: String(form.get("name") ?? ""), phone: String(form.get("phone") ?? ""), email: String(form.get("email") ?? ""),
      date: String(form.get("date") ?? ""), startTime: String(form.get("startTime") ?? ""), location: String(form.get("location") ?? ""), equipment: String(form.get("equipment") ?? ""),
      quantity: Number(form.get("quantity") ?? 1), guests: Number(form.get("guests") ?? 0), eventType: String(form.get("eventType") ?? ""), notes: String(form.get("notes") ?? ""), status: "New" as const,
    };

    try {
      const id = await createBookingRequest(request);
      setReference(id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      event.currentTarget.reset();
    } catch {
      setError("We could not record your request right now. Please try again in a moment. If the problem continues, contact Avram directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link><Link href="/" className="button buttonLight">Back to site</Link></div></nav>
      <div className="formWrap">
        <div className="sectionHead"><span className="kicker">Online booking request</span><h1 style={{fontSize:"clamp(2.6rem,6vw,4.5rem)"}}>Tell us about your event.</h1><p>Give Avram the details once. Your request is organized for review, so you do not need to repeat the same information in WhatsApp.</p></div>
        <div className="formCard">
          {submitted ? <div className="confirm"><div className="confirmIcon">🎉</div><h2>Request received</h2><p>Your booking request has been recorded.</p><p><strong>Request #{reference}</strong></p><p>Avram Kids can now review your event details and contact you when your request is ready for an availability check or confirmation. You do not need to send the same request again by WhatsApp.</p><div className="actions" style={{justifyContent:"center"}}><Link className="button buttonPrimary" href="/">Return to Avram Kids</Link></div></div> : <form onSubmit={handleSubmit}><div className="formGrid">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
            <div className="field"><label htmlFor="email">Email <span style={{fontWeight:400}}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="date">Event date</label><input id="date" name="date" required type="date" /></div>
            <div className="field"><label htmlFor="startTime">Event start time</label><input id="startTime" name="startTime" required type="time" /></div>
            <div className="field"><label htmlFor="guests">Estimated guests</label><input id="guests" name="guests" required type="number" min="1" placeholder="e.g. 30" /></div>
            <div className="field fieldFull"><label htmlFor="location">Event location</label><input id="location" name="location" required placeholder="Area, venue or address" /></div>
            <div className="field fieldFull"><label htmlFor="equipment">Equipment</label><select id="equipment" name="equipment" required defaultValue={preselected}><option value="" disabled>Select equipment</option>{equipment.map((item) => <option key={item.id} value={item.name}>{item.name} — {item.size} — {item.price}</option>)}</select></div>
            <div className="field"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" required type="number" min="1" defaultValue="1" /></div>
            <div className="field"><label htmlFor="eventType">Event type</label><select id="eventType" name="eventType" required defaultValue=""><option value="" disabled>Select one</option><option>Birthday</option><option>School / daycare</option><option>Family day</option><option>Church / community event</option><option>Corporate event</option><option>Other</option></select></div>
            <div className="field fieldFull"><label htmlFor="notes">Anything else we should know? <span style={{fontWeight:400}}>(optional)</span></label><textarea id="notes" name="notes" placeholder="Guest needs, package ideas or other useful details" /></div>
            <div className="field fieldFull"><button className="button buttonPrimary" type="submit" disabled={busy}>{busy ? "Sending request…" : "Submit booking request"}</button></div>
          </div>{error && <p role="alert" style={{color:"#b42318",lineHeight:1.6}}>{error}</p>}<p style={{color:"var(--muted)",fontSize:".84rem",lineHeight:1.6,marginBottom:0}}>Submitting creates a request for Avram to review. A booking is only confirmed after availability has been checked and Avram confirms it.</p></form>}
        </div>
      </div>
    </main>
  );
}
