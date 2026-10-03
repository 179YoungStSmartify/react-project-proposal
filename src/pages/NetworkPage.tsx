import { validProjectUrl, networkScopeNote } from "../data";
import { TierCards } from "../features/proposal/TierCards";
export function NetworkPage() {
  const design = validProjectUrl(import.meta.env.VITE_UNIFI_PROJECT_URL);
  return (
    <main tabIndex={-1} id="main-content" className="page network-page">
      <div className="section-heading">
        <span className="eyebrow">Connectivity</span>
        <h1>Network design</h1>
        <p>
          {networkScopeNote} Home network options are separately quoted as
          indicative hardware. Final coverage is confirmed after the site
          survey.
        </p>
      </div>
      <div className="network-link-card">
        <h2>UniFi Design Center</h2>
        {design ? (
          <p>
            <a href={design} target="_blank" rel="noreferrer">
              Open the configured project design ↗
            </a>
          </p>
        ) : (
          <p>
            Project design link not configured. No project-specific URL has been
            supplied.
          </p>
        )}
        <a href="https://design.ui.com" target="_blank" rel="noreferrer">
          Visit UniFi Design Center ↗
        </a>
      </div>
      <TierCards network />
      <a className="text-link" href="#/?section=network-options">
        Compare network options
      </a>
    </main>
  );
}
