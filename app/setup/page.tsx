import { Header, Footer } from "../site-shell";
import { Setup } from "../portal/portal-client";
export const metadata = {
  title: "Administrator setup",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Setup />
      </main>
      <Footer />
    </>
  );
}
