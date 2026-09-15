"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const offerings = ["Jumping Castles", "Water Slides", "Obstacle Courses", "Interactive Games"];

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="bookPage">
      <nav className="nav"><div className="container navInner"><Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link><Link href="/" className="button buttonLight">Back to site</Link></div></nav>
      <div className="formWrap">
        <div className="sectionHead"><span className="kicker">Booking request</span><h1 style={{fontSize:"clamp(2.6rem,6vw,4.5rem)"}}>Tell us about your event.</h1><p>Send the details below. This is a request for availability, not an instant confirmation.</p></div>
        <div className="formCard">
          {submitted ? <div className="confirm"><div className="confirmIcon">🎉</div><h2>Request received</h2><p>We&apos;ve received your request on this website. Avram Kids will need to confirm availability and contact you about the booking.</p><div className="actions" style={{justifyContent:"center"}}><a className="button buttonPrimary" href="https://wa.me/26776303879">Contact Avram on WhatsApp</a><a className="button buttonLight" href="tel:+26776303879">Call +267 7630 3879</a></div><p style={{marginTop:20}}><Link href="/">Return to Avram Kids</Link></p></div> : <form onSubmit={handleSubmit}><div className="formGrid">
            <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
            <div className="field"><label htmlFor="email">Email <span style={{fontWeight:400}}>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="date">Event date</label><input id="date" name="date" required type="date" /></div>
            <div className="field fieldFull"><label htmlFor="location">Event location</label><input id="location" name="location" required placeholder="Area, venue or address" /></div>
            <div className="field"><label htmlFor="offering">What are you interested in?</label><select id="offering" name="offering" required defaultValue=""><option value="" disabled>Select an offering</option>{offerings.map(item => <option key={item}>{item}</option>)}</select></div>
            <div className="field"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" required type="number" min="1" defaultValue="1" /></div>
            <div className="field fieldFull"><label htmlFor="notes">Anything else we should know?</label><textarea id="notes" name="notes" placeholder="Guest count, event type, timing or other useful details" /></div>
            <div className="field fieldFull"><button className="button buttonPrimary" type="submit">Send booking request</button></div>
          </div><p style={{color:"var(--muted)",fontSize:".84rem",lineHeight:1.6,marginBottom:0}}>Submitting this form records your request only in this browser session. It does not create a confirmed booking or make a Firebase payment/booking transaction.</p></form>}
        </div>
      </div>
    </main>
  );
}
