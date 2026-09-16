import { Header, Footer } from "../site-shell";
import { PublicContent } from "../public-content";
export const metadata = { title: "Upcoming events" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-intro">
          <p className="eyebrow red-text">GATHER. CONNECT. SERVE.</p>
          <h1>Upcoming events</h1>
          <p className="muted">
            The next opportunities to come together across SEMP USA.
          </p>
        </div>
        <div className="content-wrap">
          <section aria-labelledby="program-calendar">
            <h2 id="program-calendar">2026 annual program</h2>
            <p className="muted">These programs recur each year. Venues and further event details will be announced.</p>
            <div className="event-list" style={{ marginTop: 28, marginBottom: 40 }}>
              {[
                ["January", "Community outreach"],
                ["April", "Leadership seminar and retreat"],
                ["August", "Organization’s annual convention"],
                ["October 15", "Community outreach"],
                ["December", "Zonal end of year activities"],
              ].map(([date, title]) => (
                <article className="event-card" key={date}>
                  <span className="eyebrow red-text">{date}, 2026</span>
                  <h3>{title}</h3>
                  <p>{date === "October 15" ? "Annual outreach. Venue and time to be confirmed." : "Annual program. Exact date and venue to be confirmed."}</p>
                </article>
              ))}
            </div>
          </section>
          <PublicContent type="events" />
          <section aria-labelledby="past-highlights" style={{ marginTop: 48 }}>
            <h2 id="past-highlights">Past event highlights</h2>
            <article className="outreach-story" style={{ marginTop: 28 }}>
              <figure>
                <img
                  src="/atlanta-leadership-summit.webp"
                  width="1280"
                  height="960"
                  alt="Sea Eagle Marine Patrol USA Inc. leadership summit participants gathered for a group photo in Atlanta"
                  loading="lazy"
                />
                <figcaption>Sea Eagle Marine Patrol USA Inc. Leadership Summit, Atlanta, Georgia.</figcaption>
              </figure>
              <div className="outreach-story-copy">
                <p className="eyebrow red-text">LEADERSHIP / ATLANTA, GEORGIA</p>
                <h2>Leadership Summit in Atlanta</h2>
                <p>Sea Eagle Marine Patrol USA Inc. held its Leadership Summit in
                  Atlanta, bringing members together in the spirit of brotherhood,
                  unity, and service to humanity.</p>
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
