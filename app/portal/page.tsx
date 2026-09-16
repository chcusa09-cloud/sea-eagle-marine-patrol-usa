import { Header, Footer } from "../site-shell";
import { Portal } from "./portal-client";
export const metadata = {
  title: "Member portal",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Portal />
      </main>
      <Footer />
    </>
  );
}
