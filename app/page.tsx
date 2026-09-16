import {
  Anchor,
  ArrowUpRight,
  ArrowDown,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Waves,
  LockKeyhole,
  CalendarDays,
} from "lucide-react";
import { Header, Footer } from "./site-shell";
const flotillas = [
  ["Gulf", "Houston, Texas"],
  ["NLF", "Northlake, Dallas, TX"],
  ["Kattegat", "Maryland"],
  ["Debullz", "Chicago, IL"],
  ["South Atlantic", "Atlanta, GA"],
  ["Hollywood", "Los Angeles, CA"],
];
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero cinematic">
          <figure className="hero-art">
          <div className="hero-art-frame">
          <div className="ship-scene">
          <img
            className="hero-ocean"
            src="/viking-hero.webp"
            alt="Water-level view of a dark wooden Viking ship sailing toward the sunset, with the SEMP emblem on its sail and carved into its hull"
            fetchPriority="high"
          />
          <svg className="ocean-filter-defs" aria-hidden="true" width="0" height="0">
            <defs>
              <filter id="sail-breeze" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.008 0.024" numOctaves="1" seed="12" result="breeze">
                  <animate attributeName="baseFrequency" values="0.008 0.024;0.011 0.032;0.008 0.024" dur="6s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="breeze" scale="10.2" xChannelSelector="R" yChannelSelector="G">
                  <animate attributeName="scale" values="5.1;10.2;6.8;5.1" dur="7s" repeatCount="indefinite" />
                </feDisplacementMap>
              </filter>
              <filter id="ocean-ripple" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.065" numOctaves="1" seed="7" result="water-noise">
                  <animate attributeName="baseFrequency" values="0.012 0.065;0.016 0.085;0.012 0.065" dur="9s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="water-noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
          <div className="ocean-motion" aria-hidden="true">
            <img src="/viking-hero.webp" alt="" className="ocean-ripple-image" />
          </div>
          <div className="sail-motion" aria-hidden="true">
            <img src="/viking-hero.webp" alt="" />
          </div>
          </div>
          </div>
          <label className="ocean-motion-toggle">
            <input type="checkbox" />
            Pause scene animation
          </label>
          </figure>
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> UNITED IN PURPOSE. ANCHORED IN SERVICE.
            </p>
            <h1>
              ONE SHIP.
              <br />
              <em>ONE COURSE.</em>
              <br />
              ONE MARINE.
            </h1>
            <p className="hero-description">
              Welcome to Sea Eagle Marine Patrol USA, Inc. Together, we turn
              compassion into service, bringing hope, uplifting communities,
              and being a blessing to every life we reach.
            </p>
            <div className="actions">
              <a className="button red" href="/outreach">
                Our charitable outreach <ArrowUpRight size={20} />
              </a>
              <a className="text-link light" href="#mission">
                Explore our mission <ArrowDown size={18} />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <span>SEMP USA / ONE COMMUNITY, A SHARED RESPONSIBILITY</span>
            <a href="#mission" aria-label="Scroll to our mission">
              <ArrowDown size={23} />
            </a>
          </div>
        </section>
        <div className="values-bar">
          <span>
            <ShieldCheck /> Youth empowerment
          </span>
          <span>
            <Waves /> Community development
          </span>
          <span>
            <HeartHandshake /> Charitable service
          </span>
          <span>
            <Compass /> A common course
          </span>
        </div>
        <section className="section mission" id="mission">
          <div>
            <p className="eyebrow red-text">01 — OUR TRUE NORTH</p>
            <h2>
              We are defined
              <br />
              by how we <em>serve.</em>
            </h2>
            <div className="mission-seal">
              <Anchor size={28} />
              <span>
                SEA EAGLE
                <br />
                <b>MARINE PATROL USA</b>
              </span>
            </div>
          </div>
          <div>
            <p className="lead">
              Brotherhood. Humanitarian service. Community development.
            </p>
            <p className="muted">
              Sea Eagle Marine Patrol USA Inc. (SEMP USA Inc.) is a registered
              501(c)(3) charitable organization committed to fostering brotherhood,
              humanitarian service, and community development.
            </p>
            <p className="muted">
              Our mission is to uplift underserved communities through education,
              empowerment, charitable outreach, and promotion of cultural values
              that encourage discipline, unity, and responsible citizenship.
            </p>
            <div className="mission-points">
              <article>
                <HeartHandshake />
                <h3>Charitable &amp; Humanitarian Services</h3>
                <p>
                  To provide support to the less privileged through food drives,
                  welfare assistance, health awareness, and disaster relief efforts.
                </p>
              </article>
              <article>
                <ShieldCheck />
                <h3>Education &amp; Youth Empowerment</h3>
                <p>
                  To promote education, mentorship, and leadership development
                  among youths and encourage positive community engagement.
                </p>
              </article>
              <article>
                <Waves />
                <h3>Community Development</h3>
                <p>
                  To collaborate with other charitable bodies to promote peace,
                  community service, environmental awareness, and social well-being.
                </p>
              </article>
              <article>
                <Compass />
                <h3>Cultural Unity &amp; Brotherhood</h3>
                <p>
                  To promote unity, integrity, and respect for humanity while
                  upholding the principles of brotherhood and service to humanity.
                </p>
              </article>
            </div>
            <div className="mission-vision">
              <h3>Our vision</h3>
              <p>To be a leading Patrol recognized for excellence in humanitarian
                service, community impact, and upholding the noble ideals of
                service to humanity.</p>
              <h3>Our motto</h3>
              <p>Service to Humanity.</p>
            </div>
          </div>
        </section>
        <section className="community-grid">
          <a href="/outreach" className="community-feature outreach-feature">
            <span className="eyebrow">02 — SERVICE IN ACTION</span>
            <HeartHandshake size={47} strokeWidth={1.2} />
            <h2>
              Humanity.
              <br />
              At the heart
              <br />
              of everything.
            </h2>
            <p>
              Discover our charitable initiatives,
              <br />
              donations, and community outreach.
            </p>
            <span className="feature-link">
              Explore outreach <ArrowUpRight size={24} />
            </span>
          </a>
          <a href="/events" className="community-feature events-feature">
            <span className="eyebrow">03 — COME TOGETHER</span>
            <CalendarDays size={47} strokeWidth={1.2} />
            <h2>
              Make room
              <br />
              for something
              <br />
              <em>meaningful.</em>
            </h2>
            <p>
              Gatherings, community events,
              <br />
              and the next opportunity to serve.
            </p>
            <span className="feature-link">
              Upcoming events <ArrowUpRight size={24} />
            </span>
          </a>
        </section>
        <section className="section flotillas" id="flotillas">
          <div className="section-heading">
            <div>
              <p className="eyebrow red-text">04 — OUR FLOTILLAS</p>
              <h2>
                Different waters.
                <br />
                <em>The same course.</em>
              </h2>
            </div>
            <p className="muted">
              Local connections. A united community.
              <br />
              Our purpose travels with every chapter.
            </p>
          </div>
          <div className="flotilla-grid">
            {flotillas.map(([name, location], i) => (
              <article key={name}>
                <span className="chapter-number">0{i + 1}</span>
                <Anchor size={28} />
                <h3>{name}</h3>
                <p>
                  FLOTILLA <span> / </span> {location}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="member-banner" id="portal">
          <div>
            <p className="eyebrow">YOUR COMMUNITY, CONNECTED</p>
            <h2>
              Welcome to
              <br />
              <em>your side of the ship.</em>
            </h2>
            <p>
              Your membership. Your dues. Your crew.
              <br />
              Everything you need, in one private space.
            </p>
            <a className="button white" href="/portal">
              Enter the member portal <LockKeyhole size={18} />
            </a>
          </div>
          <div className="member-crest">
            <img
              src="/sea-eagle-logo.jpeg"
              alt="SEMP USA: Service to Humanity"
            />
          </div>
        </section>
        <section className="section media" id="tv">
          <div>
            <p className="eyebrow red-text">05 — SEMP TV</p>
            <h2>
              Our stories.
              <br />
              <em>Our people.</em>
            </h2>
            <p className="muted">
              Leadership messages, moments of service,
              <br />
              and life across our flotillas.
            </p>
            <a className="text-link" href="/tv">
              Visit the media center <ArrowUpRight size={19} />
            </a>
          </div>
          <div className="media-placeholder">
            <Waves size={44} />
            <h3>The next story is on the horizon.</h3>
            <p>
              Videos and community highlights will appear here when published.
            </p>
            <span className="small-label">SEMP TV / MEDIA CENTER</span>
          </div>
        </section>
        <section className="section contact" id="contact">
          <div>
            <p className="eyebrow red-text">LET’S MAKE A DIFFERENCE</p>
            <h2>
              Good things start
              <br />
              with <em>a connection.</em>
            </h2>
          </div>
          <div>
            <p className="muted">
              For flotilla information, charitable partnerships, or ways to
              support our mission, we’d love to hear from you.
            </p>
            <a className="contact-email" href="tel:+18882228000">
              1-888-222-8000 <ArrowUpRight />
            </a>
            <a className="contact-email" href="mailto:sempusa22@yahoo.com">
              sempusa22@yahoo.com <ArrowUpRight />
            </a>
            <a className="contact-email" href="mailto:sempusa@gmail.com">
              sempusa@gmail.com <ArrowUpRight />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
