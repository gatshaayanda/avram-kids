"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

const equipment = [
  ["Castle with Slide", "3 × 7 m", "P850"], ["Curved Water Slide with Pool", "3 × 7 m", "P850"], ["Tropical Castle with Slide", "3 × 5.5 m", "P700"], ["Tropical Slip 'n Slide with Pool", "3 × 6 m", "P600"], ["Square Tropical Jumping Castle", "4.5 × 4.5 m", "P600"], ["Tall Dual-Lane Water Slide", "3 × 6 × 2.5 m", "P1,000"], ["Long Dual-Lane Slip 'n Slide", "2 × 8 m", "P650"], ["Tropical Castle & Slide Combo", "3 × 6 m", "P600"], ["Classic Open Jumping Castle", "3 × 3 m", "P500"], ["Tropical Castle Combo", "3 × 5.5 m", "P700"], ["Dual-Lane Slip 'n Slide", "3.3 × 8 m", "P900"],
];

export default function BookForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("equipment") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const request = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(),
      name: String(form.get("name") ?? ""), phone: String(form.get("phone") ?? ""), email: String(form.get("email") ?? ""),
      date: String(form.get("date") ?? ""), startTime: String(form.get("startTime") ?? ""), location: String(form.get("location") ?? ""), equipment: String(form.get("equipment") ?? ""),
      quantity: Number(form.get("quantity") ?? 1), guests: Number(form.get("guests") ?? 0), eventType: String(form.get("eventType") ?? ""), notes: String(form.get("notes") ?? ""), status: "New",
    };
    const existing = JSON.parse(localStorage.getItem("avram_booking_requests_v1") ?? "[]");
    localStorage.setItem("avram_booking_requests_v1", JSON.stringify([request, ...existing]));
    setReference(request.id.slice(0, 8).toUpperCase());
    setSubmitted(true);
  }

  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link><Link href="/" className="button buttonLight">Back to site</Link></div></nav>
      <div className="formWrap">
        <div className="sectionHead"><span className="kicker">Online booking request</span><h1 style={{fontSize:"clamp(2.6rem,6vw,4.5rem)"}}>Tell us about your event.</h1><p>Give Avram the details once. Your request is organized for review, so you do not need to repeat the same information in WhatsApp messages.</p></div>
        <div className="formCard">
          {submitted ? <div className="confirm"><div className="confirmIcon">🎉</div><h2>Request received</h2><p>Your booking request has been recorded.</p><p><strong>Request #{reference}</strong></p><p>Avram Kids can now review your event details and contact you when your request is ready for an availability check or confirmation. You do not need to send the same request again by WhatsApp.</p><div className="actions" style={{justifyContent:"center"}}><Link className="button buttonPrimary" href="/">Return to Avram Kids</Link></div></div> : <form onSubmit={handleSubmit}><div className="formGrid">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
            <div className="field"><label htmlFor="email">Email <span style={{fontWeight:400}}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="date">Event date</label><input id="date" name="date" required type="date" /></div>
            <div className="field"><label htmlFor="startTime">Event start time</label><input id="startTime" name="startTime" required type="time" /></div>
            <div className="field"><label htmlFor="guests">Estimated guests</label><input id="guests" name="guests" required type="number" min="1" placeholder="e.g. 30" /></div>
            <div className="field fieldFull"><label htmlFor="location">Event location</label><input id="location" name="location" required placeholder="Area, venue or address" /></div>
            <div className="field fieldFull"><label htmlFor="equipment">Equipment</label><select id="equipment" name="equipment" required defaultValue={preselected}><option value="" disabled>Select equipment</option>{equipment.map(([name, size, price]) => <option key={name} value={name}>{name} — {size} — {price}</option>)}</select></div>
            <div className="field"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" required type="number" min="1" defaultValue="1" /></div>
            <div className="field"><label htmlFor="eventType">Event type</label><select id="eventType" name="eventType" required defaultValue=""><option value="" disabled>Select one</option><option>Birthday</option><option>School / daycare</option><option>Family day</option><option>Church / community event</option><option>Corporate event</option><option>Other</option></select></div>
            <div className="field fieldFull"><label htmlFor="notes">Anything else we should know? <span style={{fontWeight:400}}>(optional)</span></label><textarea id="notes" name="notes" placeholder="Guest needs, package ideas or other useful details" /></div>
            <div className="field fieldFull"><button className="button buttonPrimary" type="submit">Submit booking request</button></div>
          </div><p style={{color:"var(--muted)",fontSize:".84rem",lineHeight:1.6,marginBottom:0}}>Submitting creates a request for Avram to review. A booking is only confirmed after availability has been checked and Avram confirms it.</p></form>}
        </div>
      </div>
    </main>
  );
}
