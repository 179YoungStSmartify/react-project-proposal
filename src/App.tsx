import { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Button } from "./components/ui/button";
import { ProposalPage } from "./pages/ProposalPage";
import { ViewerPage } from "./pages/ViewerPage";
import { NetworkPage } from "./pages/NetworkPage";
import { useRoute } from "./lib/routing";
export default function App() {
  const { path, section, hash } = useRoute();
  useEffect(() => {
    document.title = `${path === "/viewer" ? "3D Home Viewer" : path === "/network" ? "Network Design" : path === "/" ? "Smart Home Proposal" : "Page not found"} | 179 Young Street`;
    const frame = requestAnimationFrame(() => {
      if (path === "/" && section)
        document.getElementById(section)?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [path, section, hash]);
  return (
    <>
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
    </>
  );
}
