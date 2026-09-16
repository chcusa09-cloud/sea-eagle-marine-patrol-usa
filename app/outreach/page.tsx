import { Header, Footer } from "../site-shell";
import { PublicContent } from "../public-content";
export const metadata = { title: "Charitable outreach" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-intro">
          <p className="eyebrow red-text">SERVICE TO HUMANITY</p>
          <h1>Charitable outreach</h1>
          <p className="muted">
            Community initiatives, charitable donations, and the people we
            serve.
          </p>
        </div>
        <div className="content-wrap">
          <article className="outreach-story">
            <figure>
              <img
                src="/gulf-houston-food-bank.webp"
                width="1600"
                height="1200"
                alt="Gulf Flotilla members in red SEMP shirts gathered at Houston Food Bank with a charity outreach banner"
              />
              <figcaption>Gulf Flotilla at Houston Food Bank, Houston, Texas.</figcaption>
            </figure>
            <div className="outreach-story-copy">
              <p className="eyebrow red-text">GULF FLOTILLA / HOUSTON, TEXAS</p>
              <h2>Charity outreach at Houston Food Bank</h2>
              <p>Members of the Gulf Flotilla came together for charitable outreach
                at Houston Food Bank, putting our commitment to service to humanity
                into action in the Houston community.</p>
            </div>
          </article>
          <article className="outreach-story">
            <figure>
              <img
                src="/atlanta-charity-outreach.webp"
                width="1600"
                height="1200"
                alt="Sea Eagle Marine Patrol USA Inc. members gathered with a cart of supplies during charity outreach in Atlanta"
                loading="lazy"
              />
              <figcaption>Sea Eagle Marine Patrol USA Inc. charity outreach in Atlanta, Georgia.</figcaption>
            </figure>
            <div className="outreach-story-copy">
              <p className="eyebrow red-text">ATLANTA, GEORGIA / SERVICE TO HUMANITY</p>
              <h2>Charity outreach in Atlanta</h2>
              <p>Sea Eagle Marine Patrol USA Inc. members came together for
                charitable outreach in Atlanta, sharing supplies and putting
                compassion into action through service to the community.</p>
            </div>
          </article>
          <PublicContent type="outreach" />
          <div className="panel" style={{ marginTop: 35 }}>
            <h2>Support the mission</h2>
            <p className="muted">
              To discuss donations or partner with SEMP USA on a charitable
              initiative, contact our team.
            </p>
            <a
              href="mailto:sempusa22@yahoo.com?subject=SEMP%20USA%20charitable%20outreach"
              className="button red"
            >
              Contact SEMP USA
            </a>
            <p className="privacy-note">
              Online donations are not currently available.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
