import { ArrowUpRight, Anchor } from "lucide-react";
// Add only verified organization profile URLs; never guess account handles.
const socialProfiles = [
  { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/share/1Bh5jhd5Q4/?mibextid=wwXIfr" },
  { name: "TikTok", icon: "tiktok", url: "" },
  { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/sempusainc/" },
];
export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="top-strip">
        <span>SERVICE TO HUMANITY</span>
        <span>ONE SHIP, ONE COURSE, ONE MARINE</span>
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
            One Ship, One Course, One Marine.
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
      <section className="footer-social" aria-labelledby="social-heading">
        <div>
          <p className="eyebrow">STAY CONNECTED</p>
          <h2 id="social-heading">Reach us on social media.</h2>
        </div>
        <ul className="social-platforms" aria-label="Social media platforms">
          {socialProfiles.map(({ name, icon, url }) => {
            const content = <><img src={`/social-${icon}.svg`} width="23" height="23" alt="" /><span>{name}</span></>;
            return <li key={icon}>{url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`SEMP USA on ${name} (opens in a new tab)`}>{content}</a>
            ) : <span className="social-profile-pending">{content}</span>}</li>;
          })}
        </ul>
      </section>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Sea Eagle Marine Patrol USA Inc.
        </span>
        <a href="mailto:info@sempusa.org">info@sempusa.org</a>
      </div>
    </footer>
  );
}
