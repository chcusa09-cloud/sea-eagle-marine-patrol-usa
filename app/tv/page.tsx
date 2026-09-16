import { Header, Footer } from "../site-shell";
import { Waves } from "lucide-react";
export const metadata = { title: "SEMP TV" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-intro">
          <p className="eyebrow red-text">OUR COMMUNITY, IN FOCUS</p>
          <h1>SEMP TV & media center</h1>
          <p className="muted">
            Leadership messages, community highlights, and stories of service.
          </p>
        </div>
        <div className="content-wrap">
          <div className="media-placeholder">
            <Waves size={44} />
            <h2>Our next chapter is coming.</h2>
            <p>
              Videos and photos will be shared here when they are available.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
