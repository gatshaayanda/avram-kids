import Link from "next/link";

const offerings = [
  ["🏰", "Jumping Castles", "Big-energy fun for birthdays, family days and celebrations."],
  ["💦", "Water Slides", "A refreshing centrepiece for sunny events and summer fun."],
  ["🏃", "Obstacle Courses", "Keep guests moving with active, challenge-filled entertainment."],
  ["🎯", "Interactive Games", "Add variety with games designed to keep everyone involved."],
];

export default function Home() {
  return (
    <main className="site">
      <div className="topbar"><div className="container topbarInner"><span>Avram Kids · event equipment hire</span><strong>Gaborone & surrounding areas</strong></div></div>
      <nav className="nav"><div className="container navInner">
        <Link href="/" className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</Link>
        <div className="navLinks"><a href="#offerings">What we offer</a><a href="#how">How it works</a><a href="#specials">Specials</a></div>
        <Link href="/book" className="button buttonPrimary">Book Now</Link>
      </div></nav>

      <section className="hero"><div className="container heroGrid">
        <div>
          <span className="eyebrow">Make room for fun</span>
          <h1>Big fun for little moments.</h1>
          <p>Bring your next birthday, school day, family gathering or celebration to life with Avram Kids equipment hire.</p>
          <div className="actions"><Link href="/book" className="button buttonPrimary">Start a booking</Link><a className="button buttonLight" href="https://wa.me/26776303879">WhatsApp us</a></div>
        </div>
        <div className="heroArt" aria-label="Playful jumping castle illustration">
          <div className="blob" /><div className="blobTwo" /><div className="castle"><div className="tower left" /><div className="tower right" /><div className="castleMain"><div className="door" /></div></div>
        </div>
      </div></section>

      <section id="offerings" className="section"><div className="container">
        <div className="sectionHead"><span className="kicker">Choose your fun</span><h2>Something for every celebration.</h2><p>Tell us what you have in mind and we&apos;ll help you check the right equipment for your event.</p></div>
        <div className="cards">{offerings.map(([icon, title, text]) => <article className="card" key={title}><div className="cardIcon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section id="specials" className="section sectionSoft"><div className="container">
        <div className="special"><div><span className="kicker">Specials</span><h2>Something special may be waiting.</h2><p>This area is ready for Avram Kids to publish current specials and packages. Check with Avram when you make your booking request for what&apos;s currently available.</p></div><span className="specialBadge">Coming from Avram</span></div>
      </div></section>

      <section id="how" className="section"><div className="container">
        <div className="sectionHead"><span className="kicker">Simple booking</span><h2>From idea to event day.</h2></div>
        <div className="steps"><article className="step"><span className="stepNo">01</span><h3>Choose what you want</h3><p>Pick an equipment category that fits your event.</p></article><article className="step"><span className="stepNo">02</span><h3>Send your request</h3><p>Share your date, location and event details.</p></article><article className="step"><span className="stepNo">03</span><h3>Avram checks</h3><p>Avram confirms availability and the next steps.</p></article><article className="step"><span className="stepNo">04</span><h3>Booking confirmed</h3><p>Once confirmed, you can look forward to event day.</p></article></div>
      </div></section>

      <section className="section sectionSoft"><div className="container">
        <div className="sectionHead"><span className="kicker">Event support</span><h2>Fun, with the practical bits covered.</h2></div>
        <div className="trustGrid"><article className="trust"><h3>Setup & breakdown</h3><p>Equipment can be part of the event support from setup through breakdown, subject to your confirmed booking.</p></article><article className="trust"><h3>Clean equipment</h3><p>Equipment is prepared and checked as part of the service before it reaches your event.</p></article><article className="trust"><h3>Talk to a person</h3><p>Have a question before booking? Use WhatsApp or phone and speak directly with Avram.</p></article></div>
      </div></section>

      <section className="cta"><div className="container ctaInner"><div><span className="kicker">Ready when you are</span><h2>Let&apos;s plan the fun.</h2><p>Send a booking request and Avram will get back to you about availability.</p></div><Link href="/book" className="button buttonDark">Book Avram Kids</Link></div></section>

      <footer className="footer"><div className="container footerGrid"><div><div className="logo"><span className="logoMark" aria-hidden="true" />Avram Kids</div><p>Equipment hire for celebrations, family days and events.</p></div><div><strong>Contact</strong><p><a href="tel:+26776303879">+267 7630 3879</a><br /><a href="https://wa.me/26776303879">WhatsApp</a></p></div><div><strong>Follow</strong><p><a href="https://www.facebook.com/avramkids/">Facebook</a><br /><a href="https://www.instagram.com/avramkids/">Instagram</a></p></div></div></footer>
    </main>
  );
}
