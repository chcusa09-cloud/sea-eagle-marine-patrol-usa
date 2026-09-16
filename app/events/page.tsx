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
        </div>
      </main>
      <Footer />
    </>
  );
}
