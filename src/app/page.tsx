import Link from "next/link";

const equipment = [
  { name: "Castle with Slide", detail: "Red / blue / yellow with turrets", size: "3 × 7 m", price: "P850" },
  { name: "Curved Water Slide with Pool", detail: "Refreshing water-slide setup", size: "3 × 7 m", price: "P850" },
  { name: "Tropical Castle with Slide", detail: "Green / orange with palm trees", size: "3 × 5.5 m", price: "P700" },
  { name: "Tropical Slip 'n Slide with Pool", detail: "Palm-tree tropical setup", size: "3 × 6 m", price: "P600" },
  { name: "Square Tropical Jumping Castle", detail: "Palm-tree jumping castle", size: "4.5 × 4.5 m", price: "P600" },
  { name: "Tall Dual-Lane Water Slide", detail: "Splash pool included", size: "3 × 6 × 2.5 m", price: "P1,000" },
  { name: "Long Dual-Lane Slip 'n Slide", detail: "Blue / yellow", size: "2 × 8 m", price: "P650" },
  { name: "Tropical Castle & Slide Combo", detail: "Blue tarp setup", size: "3 × 6 m", price: "P600" },
  { name: "Classic Open Jumping Castle", detail: "Yellow pillars", size: "3 × 3 m", price: "P500" },
  { name: "Tropical Castle Combo", detail: "Front slide", size: "3 × 5.5 m", price: "P700" },
  { name: "Dual-Lane Slip 'n Slide", detail: "Overhead arches", size: "3.3 × 8 m", price: "P900" },
];

const categories = [
  ["🏰", "Jumping Castles", "Bright, energetic favourites for birthdays, family days and celebrations."],
  ["💦", "Water Fun", "Water slides and slip 'n slides for sunny events and summer fun."],
  ["🏃", "Active Play", "Obstacle-style and interactive entertainment to keep guests moving."],
  ["🎯", "Interactive Games", "Add variety to your event with activities designed to keep everyone involved."],
];

export default function Home() {
  return (
    <main className="site">
      <div className="topbar"><div className="container topbarInner"><span>Avram Kids · kids entertainment & event equipment hire</span><strong>Gaborone, Botswana</strong></div></div>
      <nav className="nav"><div className="container navInner">
        <Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link>
        <div className="navLinks"><a href="#equipment">Equipment</a><a href="#how">How it works</a><a href="#specials">Specials</a></div>
        <Link href="/book" className="button buttonPrimary">Book Now</Link>
      </div></nav>

      <section className="hero"><div className="container heroGrid">
        <div>
          <span className="eyebrow">Fun is ready to arrive</span>
          <h1>Big fun for little moments.</h1>
          <p>Make birthdays, school days, family gatherings and celebrations memorable with vibrant Avram Kids inflatables and event equipment for hire in Gaborone.</p>
          <div className="actions"><Link href="/book" className="button buttonPrimary">Start a booking</Link><a className="button buttonLight" href="https://wa.me/26777997996">WhatsApp us</a></div>
          <p className="heroNote">Clean equipment · Professional setup · Responsive WhatsApp support</p>
        </div>
        <div className="heroArt" aria-label="Playful jumping castle illustration">
          <div className="blob" /><div className="blobTwo" /><div className="castle"><div className="tower left" /><div className="tower right" /><div className="castleMain"><div className="door" /></div></div>
        </div>
      </div></section>

      <section id="equipment" className="section"><div className="container">
        <div className="sectionHead"><span className="kicker">Equipment for hire</span><h2>Pick the fun that fits your event.</h2><p>These are the current listed equipment options and prices. Custom event packages can also be discussed with Avram Kids.</p></div>
        <div className="equipmentGrid">{equipment.map((item) => <article className="equipmentCard" key={item.name}><div className="equipmentTop"><span className="equipmentPill">FOR HIRE</span><strong>{item.price}</strong></div><div className="equipmentVisual" aria-hidden="true">{item.name.toLowerCase().includes("water") || item.name.toLowerCase().includes("slide") ? "💦" : "🏰"}</div><h3>{item.name}</h3><p>{item.detail}</p><div className="equipmentMeta"><span>{item.size}</span><span>{item.price}</span></div><Link href={`/book?equipment=${encodeURIComponent(item.name)}`} className="button buttonLight">Request this</Link></article>)}</div>
      </div></section>

      <section className="section sectionSoft"><div className="container">
        <div className="sectionHead"><span className="kicker">Choose your fun</span><h2>Built around the kind of day you&apos;re planning.</h2></div>
        <div className="cards">{categories.map(([icon, title, text]) => <article className="card" key={title}><div className="cardIcon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section id="specials" className="section"><div className="container">
        <div className="special"><div><span className="kicker">Specials & packages</span><h2>Planning something bigger?</h2><p>Custom event packages are available on request. Ask Avram about current specials, combinations and rental options for your event.</p></div><Link href="/book" className="button buttonPrimary">Ask about a package</Link></div>
      </div></section>

      <section id="how" className="section sectionSoft"><div className="container">
        <div className="sectionHead"><span className="kicker">Simple booking</span><h2>From idea to event day.</h2></div>
        <div className="steps"><article className="step"><span className="stepNo">01</span><h3>Choose your equipment</h3><p>Browse the options and pick what suits your celebration.</p></article><article className="step"><span className="stepNo">02</span><h3>Send your request</h3><p>Share your date, location, quantity and event details.</p></article><article className="step"><span className="stepNo">03</span><h3>Avram checks</h3><p>Avram confirms availability and discusses the next steps.</p></article><article className="step"><span className="stepNo">04</span><h3>Booking confirmed</h3><p>Once confirmed, your event equipment is ready to be arranged.</p></article></div>
      </div></section>

      <section className="section"><div className="container">
        <div className="sectionHead"><span className="kicker">The Avram standard</span><h2>Fun, with the practical bits covered.</h2></div>
        <div className="trustGrid"><article className="trust"><h3>Clean & prepared</h3><p>Equipment is thoroughly prepared and sanitized before and after rentals, with safety rules communicated at setup.</p></article><article className="trust"><h3>Punctual & professional</h3><p>Local delivery, setup and takedown are handled by the Avram Kids team around your confirmed event.</p></article><article className="trust"><h3>Talk to a person</h3><p>Questions before booking? WhatsApp is a direct, responsive way to speak with Avram about your event.</p></article></div>
      </div></section>

      <section className="section sectionSoft"><div className="container">
        <div className="reviewGrid"><article><span className="kicker">What clients say</span><blockquote>“Seamless and pleasant booking... quality product, customer service 10/10.”</blockquote><strong>— Neo Legwaila Masie</strong></article><article><span className="kicker">Trusted service</span><blockquote>“Professional, helpful, on time, affordable... definitely 5 Star.”</blockquote><strong>— Galyn Khan</strong></article><article><span className="kicker">On the day</span><blockquote>“Great response on WhatsApp... setup done timeously and safety rules shared.”</blockquote><strong>— Michelle Phetlhe</strong></article></div>
      </div></section>

      <section className="cta"><div className="container ctaInner"><div><span className="kicker">Ready when you are</span><h2>Let&apos;s plan the fun.</h2><p>Send a booking request and Avram will get back to you about availability.</p></div><Link href="/book" className="button buttonDark">Book Avram Kids</Link></div></section>

      <footer className="footer"><div className="container footerGrid"><div><div className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</div><p>Kids entertainment and event equipment hire in Gaborone, Botswana.</p></div><div><strong>Contact</strong><p><a href="tel:+26777997996">+267 77 997 996</a><br /><a href="mailto:bookings@avramkids.com">bookings@avramkids.com</a><br /><a href="https://wa.me/26777997996">WhatsApp</a></p></div><div><strong>Follow</strong><p><a href="https://www.facebook.com/avramkids/">Facebook</a><br /><a href="https://www.instagram.com/avramkids/">Instagram</a></p></div></div></footer>
    </main>
  );
}
