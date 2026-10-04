import { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Button } from "./components/ui/button";
import { ProposalPage } from "./pages/ProposalPage";
import { ViewerPage } from "./pages/ViewerPage";
import { NetworkPage } from "./pages/NetworkPage";
import { PrintableProposalPage } from "./pages/PrintableProposalPage";
import { useRoute } from "./lib/routing";
export default function App() {
  const { path, section, hash, navigationId } = useRoute();
  useEffect(() => {
    document.title = `${path === "/viewer" ? "3D Home Viewer" : path === "/network" ? "Network Design" : path === "/print" ? "Printable Proposal" : path === "/" ? "Smart Home Proposal" : "Page not found"} | 179 Young Street`;
    let cancelled = false;
    let frame: number | undefined;
    const scroll = () => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (path === "/" && section)
          document.getElementById(section)?.scrollIntoView();
        else window.scrollTo({ top: 0, behavior: "instant" });
      });
    };
    // Font loading changes section positions, especially on a cold mobile load.
    if (path === "/" && section)
      void (document.fonts?.ready ?? Promise.resolve()).then(scroll);
    else scroll();
    return () => {
      cancelled = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [path, section, hash, navigationId]);
  if (path === "/print") return <PrintableProposalPage />;

  return (
    <div className="site-app">
      <div className="print-shortcut-warning">
        To print the proposal, use “Print proposal” in the site navigation to
        open the print-ready version.
      </div>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <Header path={path} />
      {path === "/" ? (
        <ProposalPage />
      ) : path === "/viewer" ? (
        <ViewerPage />
      ) : path === "/network" ? (
        <NetworkPage />
      ) : (
        <main id="main-content" tabIndex={-1} className="page not-found">
          <h1>Page not found</h1>
          <p>This page is not part of the proposal.</p>
          <Button asChild>
            <a href="#/">Return to proposal</a>
          </Button>
        </main>
      )}
    </div>
  );
}
