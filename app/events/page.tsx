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
          <PublicContent type="events" />
        </div>
      </main>
      <Footer />
    </>
  );
}
