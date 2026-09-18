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
          <article className="outreach-story" id="houston-food-bank">
            <figure>
              <img
                src="/gulf-houston-food-bank.webp"
                width="1600"
                height="1200"
                alt="Gulf Flotilla members in red SEMP shirts gathered at Houston Food Bank with a charity outreach banner"
              />
              <figcaption>Gulf Flotilla at Houston Food Bank, Houston, Texas.</figcaption>
            </figure>
            <figure style={{ maxWidth: 720, margin: "24px auto 0" }}>
              <img
                src="/gulf-houston-food-bank-volunteering.webp"
                width="960"
                height="1280"
                alt="Gulf Flotilla volunteer in a red SEMP shirt packing fresh produce at Houston Food Bank"
                loading="lazy"
              />
              <figcaption>Gulf Flotilla helping pack fresh produce at Houston Food Bank.</figcaption>
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
          <article className="outreach-story">
            <figure style={{ maxWidth: 720, margin: "0 auto" }}>
              <img
                src="/foundation-donation.webp"
                width="647"
                height="662"
                alt="Sea Eagle Marine Patrol USA Inc. members presenting a large donation check to a foundation"
                loading="lazy"
              />
              <figcaption>SEMP USA Inc. presenting a donation check to a foundation.</figcaption>
            </figure>
            <div className="outreach-story-copy">
              <p className="eyebrow red-text">CHARITABLE GIVING / SERVICE TO HUMANITY</p>
              <h2>Donation check presentation to a foundation</h2>
              <p>Sea Eagle Marine Patrol USA Inc. presented a donation check to
                a foundation, continuing our commitment to charitable giving
                and service to humanity.</p>
            </div>
          </article>
          <article className="outreach-story" id="new-york-outreach">
            <figure>
              <img src="/new-york-outreach-1.webp" width="1280" height="960"
                alt="SEMP USA members gathered outdoors with boxed fans during charitable outreach"
                loading="lazy" />
              <figcaption>SEMP USA Inc. coming together for charitable service.</figcaption>
            </figure>
            <div className="outreach-photo-grid">
              <figure>
                <img src="/new-york-outreach-2.webp" width="720" height="1280"
                  alt="Outreach volunteers meeting around a table and completing paperwork"
                  loading="lazy" />
                <figcaption>Working together in service to the community.</figcaption>
              </figure>
              <figure>
                <img src="/new-york-outreach-3.webp" width="768" height="1024"
                  alt="SEMP USA members and community members gathered outside with donated supplies"
                  loading="lazy" />
                <figcaption>SEMP USA Inc. charitable outreach in New York.</figcaption>
              </figure>
            </div>
            <div className="outreach-story-copy">
              <p className="eyebrow red-text">NEW YORK / SERVICE TO HUMANITY</p>
              <h2>Supporting people experiencing homelessness in New York</h2>
              <p>Sea Eagle Marine Patrol USA Inc. extended its charitable outreach
                to people experiencing homelessness in New York, sharing support
                and compassion with our neighbors. Through service, we affirm
                the dignity of every person and our commitment to being a blessing
                to the communities we reach.</p>
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
