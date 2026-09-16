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
          <PublicContent type="outreach" />
          <div className="panel" style={{ marginTop: 35 }}>
            <h2>Support the mission</h2>
            <p className="muted">
              To discuss donations or partner with SEMP USA on a charitable
              initiative, contact our team.
            </p>
            <a
              href="mailto:info@sempusa.org?subject=SEMP%20USA%20charitable%20outreach"
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
