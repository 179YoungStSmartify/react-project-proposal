import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { TierCards } from "../features/proposal/TierCards";

import { LightingDemo } from "../features/proposal/LightingDemo";
import { ComparisonTable } from "../features/proposal/ComparisonTable";
import {
  integrationScopeNote,
  serviceScopeNote,
  networkScopeNote,
  hardwareChoiceNote,
} from "../data";
export function ProposalPage() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 480);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <main id="main-content" tabIndex={-1} className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">
            A considered home · Sunnybank, Queensland
          </span>
          <h1>
            A home that feels <em>thoughtfully connected.</em>
          </h1>
          <p>
            Smart-home integration and control, designed around the way you live
            — with local-first control, clear choices and room to make it your
            own.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <a href="#/?section=packages">Explore packages</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="hero-viewer">
              <a href="#/viewer">Explore the 3D home ↗</a>
            </Button>
          </div>
          <div className="hero-meta">
            <span>Prepared as a proposal draft</span>
            <span>Indicative pricing</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="halo">⌂</div>
          <span>LIGHT · CONTROL · COMFORT</span>
        </div>
      </section>
      <section className="intro">
        <p>
          A practical proposal for a more intuitive home. Compare three service
          tiers and try the difference between on/off and dimming below.
        </p>
      </section>
      <section className="section" id="packages">
        <div className="section-heading">
          <span className="eyebrow">Three ways to begin</span>
          <h2>Smart-home service tiers</h2>
          <p>
            {serviceScopeNote} {integrationScopeNote} Indicative proposal
            pricing. Final quantities and prices are confirmed in writing after
            the home visit, before ordering.
          </p>
          <p>{hardwareChoiceNote}</p>
        </div>
        <TierCards />
      </section>

      <LightingDemo />
      <section className="section split">
        <div>
          <span className="eyebrow">How it fits together</span>
          <h2>One system, three ways in</h2>
          <p>
            Wall switches, phone app and in-home routines work together through
            Home Assistant. Switches and routines run locally so core control
            can continue if the internet drops.
          </p>
          <ul className="clean-list">
            <li>Lights, dimmed on Platinum</li>
            <li>
              Wall-screen integration on all tiers; devices supplied separately
            </li>
            <li>Garage door and air conditioning integration on all tiers</li>
          </ul>
          <p>
            Remote access is available through a paid Nabu Casa Home Assistant
            Cloud subscription. A single Home Assistant app provides the main
            control surface; optional Google and Apple integrations depend on
            their respective cloud services.
          </p>
        </div>
        <div className="system-card">
          <span>YOU USE</span>
          <strong>Wall switches · Phone app</strong>
          <b>↓</b>
          <span>RUNS IN YOUR HOME</span>
          <strong>Home Assistant hub</strong>
          <b>↓</b>
          <span>IT CONTROLS</span>
          <strong>Lighting · Garage · Air conditioning</strong>
          <small>
            Hub and control hardware supplied separately. Local-first routines;
            optional remote access requires subscription.
          </small>
        </div>
      </section>
      <section className="section" id="network-options">
        <div className="section-heading">
          <span className="eyebrow">Connectivity</span>
          <h2>Home network options</h2>
          <p>
            We recommend a purpose-built UniFi system adapted for your home.
            Coverage is designed around your home and confirmed during the site
            survey.
          </p>
        </div>
        <TierCards network />
        <p className="small-note">
          Network pricing is hardware only, quoted separately from lighting.
          Cabling and installation are quoted at the home visit.{" "}
          {networkScopeNote}{" "}
          <a href="https://design.ui.com" target="_blank" rel="noreferrer">
            UniFi Design Center ↗
          </a>
        </p>
        <a className="text-link" href="#/network">
          Network design details →
        </a>
      </section>
      <ComparisonTable />
      <section className="section foundation">
        <span className="eyebrow">The foundation every tier shares</span>
        <h2>Local-first. Thoughtfully delivered.</h2>
        <div className="foundation-grid">
          <article>
            <h3>Local-first control</h3>
            <p>
              Switches, routines and automations run locally. Remote access uses
              an optional paid Nabu Casa subscription.
            </p>
          </article>
          <article>
            <h3>Compliance, as a prerequisite</h3>
            <p>
              Products must be approved for use in Australia and all electrical
              work must be performed by appropriately licensed electricians.
              These are procurement and delivery requirements, not claims of
              completed verification.
            </p>
          </article>
          <article>
            <h3>Designed for existing walls</h3>
            <p>
              Survey and sample stages help confirm fit and finish before
              ordering or installation.
            </p>
          </article>
          <article>
            <h3>Handover & support</h3>
            <p>
              Walkthrough and guides at handover, followed by the
              package-specific support period.
            </p>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Delivery</span>
          <h2>How we deliver</h2>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Survey",
              "Map switches and lights so quantities and fit can be confirmed.",
            ],
            [
              "02",
              "Consultation",
              "Review the detailed plan together; choose a package and any add-ons.",
            ],
            [
              "03",
              "Install & commission",
              "Licensed electricians perform electrical work; scenes and routines are commissioned.",
            ],
            [
              "04",
              "Handover",
              "Walkthrough, guides and the included support period.",
            ],
          ].map(([n, h, p]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <footer>
        <strong>Proposal draft · indicative pricing</strong>
        <p>
          {serviceScopeNote} {integrationScopeNote} {networkScopeNote} Prices
          are confirmed in writing after the home visit, before anything is
          ordered. Dimming is tested in your home during the sample stage.
          Network is quoted separately alongside your lighting tier. Garage
          automatic close must not be enabled until a safety beam/photo-eye has
          been verified and function-tested on site. Safety interlocks remain in
          the opener; suitability is not represented as already verified.
        </p>
        <p>
          Prepared by Sam Lee &amp; Angus Wong · Proposal date: 25 September
          2026.
        </p>
        <Button onClick={() => window.print()}>Print proposal</Button>
      </footer>
      <Button
        className={`back-top ${showTop ? "visible" : ""}`}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          })
        }
      >
        ↑ Top
      </Button>
    </main>
  );
}
