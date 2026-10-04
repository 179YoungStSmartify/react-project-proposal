import { networkScopeNote } from "../data";
import { TierCards } from "../features/proposal/TierCards";
export function NetworkPage() {
  return (
    <main tabIndex={-1} id="main-content" className="page network-page">
      <div className="section-heading">
        <span className="eyebrow">Connectivity</span>
        <h1>Network design</h1>
        <p>
          {networkScopeNote} Each tier below links to its interactive UniFi
          Design Center project. Final coverage is confirmed after the site
          survey.
        </p>
      </div>
      <TierCards network />
      <a className="text-link" href="#/?section=network-options">
        Compare network options
      </a>
    </main>
  );
}
