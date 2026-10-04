import { Button } from "../components/ui/button";
import { ComparisonTable } from "../features/proposal/ComparisonTable";
import { TierCards } from "../features/proposal/TierCards";
import {
  hardwareChoiceNote,
  integrationScopeNote,
  networkScopeNote,
  serviceScopeNote,
} from "../data";

export function PrintableProposalPage() {
  return (
    <main className="print-page" id="main-content" tabIndex={-1}>
      <div className="print-actions" aria-label="Print controls">
        <p>
          This print-ready proposal leaves out interactive website elements such
          as the lighting demo and navigation. Choose “Save as PDF” in the
          browser print dialog to create a PDF.
        </p>
        <div className="print-action-buttons">
          <Button onClick={() => window.print()}>Print / Save as PDF</Button>
          <Button variant="outline" asChild>
            <a href="#/">Back to proposal</a>
          </Button>
        </div>
      </div>

      <article className="print-document" aria-label="Printable proposal">
        <header className="print-header">
          <p className="print-address">179 Young Street · Sunnybank, Queensland</p>
          <h1>Smart-home proposal</h1>
          <p className="print-subtitle">
            A home that feels thoughtfully connected
          </p>
          <div className="print-meta">
            <span>Prepared by Sam Lee &amp; Angus Wong</span>
            <span>Proposal date: 25 September 2026</span>
          </div>
        </header>

        <section className="print-section print-foundation-section">
          <div className="section-heading">
            <span className="eyebrow">The shared foundation</span>
            <h2>Local-first control, with a clear handover</h2>
            <p>
              Home Assistant keeps core controls and automations local. Remote
              access and cloud-dependent services are subject to the relevant
              provider and subscription requirements.
            </p>
          </div>
          <ul className="print-foundation-list">
            <li>
              <strong>Local control:</strong> core automations continue to run
              locally when the internet is unavailable.
            </li>
            <li>
              <strong>Existing controls:</strong> existing wall controls are
              retained where compatible and safe to do so.
            </li>
            <li>
              <strong>Compatibility:</strong> final device compatibility and
              quantities are confirmed after the site visit.
            </li>
            <li>
              <strong>Handover:</strong> the selected package includes a guided
              walkthrough of the completed setup.
            </li>
          </ul>
        </section>

        <section className="print-section print-service-section">
          <div className="section-heading">
            <span className="eyebrow">Smart-home packages</span>
            <h2>Choose the right level of support</h2>
            <p>
              {serviceScopeNote} {integrationScopeNote}
            </p>
            <p>{hardwareChoiceNote}</p>
            <p className="print-pricing-note">
              Network and electrical installation costs are not included and
              are quoted separately.
            </p>
          </div>
          <TierCards />
        </section>

        <section className="print-section print-network-section">
          <div className="section-heading">
            <span className="eyebrow">Optional network packages</span>
            <h2>Home network options</h2>
            <p>
              Network hardware is a separate package. {networkScopeNote} Each
              tier links to its interactive UniFi Design Center project; final
              coverage is confirmed after a site survey.
            </p>
          </div>
          <TierCards network />
        </section>

        <section className="print-section print-comparison-section">
          <ComparisonTable linkNetworkCards={false} showCaption={false} />
        </section>

        <section className="print-section print-next-steps-section">
          <div className="section-heading">
            <span className="eyebrow">What happens next</span>
            <h2>From site visit to handover</h2>
          </div>
          <ol className="print-steps">
            <li>
              <strong>Site visit</strong>
              <span>Confirm requirements, existing equipment and constraints.</span>
            </li>
            <li>
              <strong>Written scope</strong>
              <span>Confirm compatibility, quantities and final pricing.</span>
            </li>
            <li>
              <strong>Installation</strong>
              <span>Complete the agreed smart-home package scope.</span>
            </li>
            <li>
              <strong>Handover</strong>
              <span>Walk through the system and answer questions.</span>
            </li>
          </ol>
        </section>

        <footer className="print-footer">
          <p>
            Electrical work must be completed by a licensed electrician. Final
            scope and pricing are confirmed in writing before ordering.
          </p>
          <p>179 Young Street · Sunnybank, Queensland</p>
        </footer>
      </article>
    </main>
  );
}
