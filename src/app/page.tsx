"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readEquipment, type EquipmentItem } from "@/lib/equipment";

const categories = [
  ["🏰", "Jumping Castles", "Bright, energetic favourites for birthdays, family days and celebrations."],
  ["💦", "Water Fun", "Water slides and slip 'n slides for sunny events and summer fun."],
  ["🏃", "Active Play", "Obstacle-style and interactive entertainment to keep guests moving."],
  ["🎯", "Interactive Games", "Add variety to your event with activities designed to keep everyone involved."],
];

export default function Home() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => setEquipment(readEquipment().filter((item) => item.active)), []);

  return (
    <main className="site">
      <div className="topbar"><div className="container topbarInner"><span>Avram Kids · kids entertainment & event equipment hire</span><strong>Gaborone, Botswana</strong></div></div>
      <nav className="nav"><div className="container navInner">
        <Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link>
        <div className="navLinks"><a href="#equipment">Equipment</a><a href="#how">How it works</a><a href="#specials">Specials</a></div>
        <Link href="/book" className="button buttonPrimary">Book Online</Link>
      </div></nav>

      <section className="hero"><div className="container heroGrid">
        <div>
          <span className="eyebrow">Fun is ready to arrive</span>
          <h1>Big fun for little moments.</h1>
          <p>Make birthdays, school days, family gatherings and celebrations memorable with vibrant Avram Kids inflatables and event equipment for hire in Gaborone.</p>
          <div className="actions"><Link href="/book" className="button buttonPrimary">Start a booking</Link><a className="button buttonLight" href="#how">See how it works</a></div>
          <p className="heroNote">Choose online · Share your event details once · Avram reviews your request</p>
        </div>
        <div className="heroArt" aria-label="Playful jumping castle illustration"><div className="blob" /><div className="blobTwo" /><div className="castle"><div className="tower left" /><div className="tower right" /><div className="castleMain"><div className="door" /></div></div></div>
      </div></section>

      <section id="equipment" className="section"><div className="container">
        <div className="sectionHead"><span className="kicker">Equipment for hire</span><h2>Pick the fun that fits your event.</h2><p>See the current equipment, sizes and prices, then send one complete booking request online. No need to repeat the details in messages.</p></div>
        <div className="equipmentGrid">{equipment.map((item) => <article className="equipmentCard" key={item.id}><div className="equipmentTop"><span className="equipmentPill">FOR HIRE</span><strong>{item.price}</strong></div><div className="equipmentVisual" aria-label={item.imageUrl ? `${item.name} image` : undefined}>{item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} /> : item.name.toLowerCase().includes("water") || item.name.toLowerCase().includes("slide") ? "💦" : "🏰"}</div><h3>{item.name}</h3><p>{item.detail}</p><div className="equipmentMeta"><span>{item.size}</span><span>{item.price}</span></div><Link href={`/book?equipment=${encodeURIComponent(item.name)}`} className="button buttonLight">Request this</Link></article>)}</div>
        {equipment.length === 0 && <div className="emptyState"><h3>Equipment is being updated</h3><p>Please check back shortly.</p></div>}
      </div></section>

      <section className="section sectionSoft"><div className="container"><div className="sectionHead"><span className="kicker">Choose your fun</span><h2>Built around the kind of day you&apos;re planning.</h2></div><div className="cards">{categories.map(([icon, title, text]) => <article className="card" key={title}><div className="cardIcon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section id="specials" className="section"><div className="container"><div className="special"><div><span className="kicker">Specials & packages</span><h2>Planning something bigger?</h2><p>Custom event packages are available on request. Include what you are planning in the booking form so Avram can review the complete request in one place.</p></div><Link href="/book" className="button buttonPrimary">Build my request</Link></div></div></section>
      <section id="how" className="section sectionSoft"><div className="container"><div className="sectionHead"><span className="kicker">Simple booking</span><h2>Tell Avram once. The system keeps it organized.</h2></div><div className="steps"><article className="step"><span className="stepNo">01</span><h3>Choose your equipment</h3><p>Browse the real equipment, sizes and prices before you decide.</p></article><article className="step"><span className="stepNo">02</span><h3>Send one complete request</h3><p>Share your date, location, event details, contact information and what you need.</p></article><article className="step"><span className="stepNo">03</span><h3>Avram reviews the queue</h3><p>Your request stays organized with the event details attached, ready for Avram to review when she is available.</p></article><article className="step"><span className="stepNo">04</span><h3>Confirmation comes after review</h3><p>Avram checks availability and contacts qualified requests when she is ready to confirm the booking.</p></article></div></div></section>
      <section className="section"><div className="container"><div className="sectionHead"><span className="kicker">The Avram standard</span><h2>Fun, with the practical bits covered.</h2></div><div className="trustGrid"><article className="trust"><h3>Clean & prepared</h3><p>Equipment is thoroughly prepared and sanitized before and after rentals, with safety rules communicated at setup.</p></article><article className="trust"><h3>Punctual & professional</h3><p>Local delivery, setup and takedown are handled by the Avram Kids team around your confirmed event.</p></article><article className="trust"><h3>One clear booking path</h3><p>Customers submit their event details through the website so Avram can review organized requests instead of chasing information across message threads.</p></article></div></div></section>
      <section className="section sectionSoft"><div className="container"><div className="reviewGrid"><article><span className="kicker">What clients say</span><blockquote>“Seamless and pleasant booking... quality product, customer service 10/10.”</blockquote><strong>— Neo Legwaila Masie</strong></article><article><span className="kicker">Trusted service</span><blockquote>“Professional, helpful, on time, affordable... definitely 5 Star.”</blockquote><strong>— Galyn Khan</strong></article><article><span className="kicker">On the day</span><blockquote>“Great response on WhatsApp... setup done timeously and safety rules shared.”</blockquote><strong>— Michelle Phetlhe</strong></article></div></div></section>
      <section className="cta"><div className="container ctaInner"><div><span className="kicker">Ready when you are</span><h2>Let&apos;s plan the fun.</h2><p>Send your complete booking request online. Avram will review it and get back to you about availability.</p></div><Link href="/book" className="button buttonDark">Book Avram Kids</Link></div></section>
      <footer className="footer"><div className="container footerGrid"><div><div className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</div><p>Kids entertainment and event equipment hire in Gaborone, Botswana.</p></div><div><strong>Booking</strong><p><Link href="/book">Book online</Link><br /><a href="mailto:bookings@avramkids.com">bookings@avramkids.com</a></p></div><div><strong>Follow</strong><p><a href="https://www.facebook.com/avramkids/">Facebook</a><br /><a href="https://www.instagram.com/avramkids/">Instagram</a></p></div></div></footer>
    </main>
  );
}
