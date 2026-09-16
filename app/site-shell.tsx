import { ArrowUpRight, Anchor } from "lucide-react";
export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="top-strip">
        <span>SERVICE TO HUMANITY</span>
        <span>ONE SHIP, ONE COURSE</span>
      </div>
      <header className="site-header">
        <a href="/" className="brand" aria-label="SEMP USA home">
          <img src="/sea-eagle-logo.jpeg" width="58" height="58" alt="" />
          <span>
            <b>
              SEMP <span>USA</span>
            </b>
            <small>SEA EAGLE MARINE PATROL</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#mission">Our mission</a>
          <a href="/#flotillas">Flotillas</a>
          <a href="/outreach">Outreach</a>
          <a href="/events">Upcoming events</a>
          <a href="/tv">SEMP TV</a>
          <a href="/#contact">Contact</a>
        </nav>
        <a className="button compact outline" href="/portal">
          Member portal <ArrowUpRight size={17} />
        </a>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <a href="/" className="brand footer-brand">
            <Anchor size={34} />
            <span>
              <b>SEMP USA</b>
              <small>SEA EAGLE MARINE PATROL USA INC.</small>
            </span>
          </a>
          <p>
            One Ship, One Course.
            <br />
            Service to Humanity.
          </p>
        </div>
        <div className="footer-links">
          <a href="/#mission">Our mission</a>
          <a href="/#flotillas">Flotillas</a>
          <a href="/outreach">Outreach</a>
          <a href="/events">Upcoming events</a>
          <a href="/tv">SEMP TV</a>
          <a href="/branding">Branding center</a>
          <a href="/portal">Member portal</a>
          <a href="/admin">Administration</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Sea Eagle Marine Patrol USA Inc.
        </span>
        <a href="mailto:info@sempusa.org">info@sempusa.org</a>
      </div>
    </footer>
  );
}
