import { Header, Footer } from "../site-shell";
export const metadata = { title: "Branding center" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-intro">
          <p className="eyebrow red-text">ONE SHIP, ONE COURSE</p>
          <h1>Branding center</h1>
          <p className="muted">The SEMP USA emblem and organization colors.</p>
        </div>
        <div className="content-wrap brand-download">
          <img
            src="/sea-eagle-logo.jpeg"
            alt="Sea Eagle Marine Patrol USA official emblem"
          />
          <div>
            <h2>Our shared identity</h2>
            <p className="muted">
              Use the complete emblem without altering its proportions, colors,
              or wording. Contact SEMP USA for permission and approved
              materials.
            </p>
            <div className="swatches">
              {[
                ["Red", "#b5162d"],
                ["Black", "#13161b"],
                ["White", "#ffffff"],
                ["Gold", "#dbb777"],
              ].map(([name, color]) => (
                <span key={name}>
                  <i style={{ background: color }} />
                  {name}
                </span>
              ))}
            </div>
            <a
              href="/sea-eagle-logo.jpeg"
              download="SEMP-USA-Emblem.jpeg"
              className="button red"
            >
              Download emblem
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
