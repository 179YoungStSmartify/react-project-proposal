import type { CSSProperties } from "react";
import { lightingTiers, networkTiers, networkScopeNote } from "../../data";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
export function TierCards({ network = false }: { network?: boolean }) {
  const tiers = network ? networkTiers : lightingTiers;
  const specCount = tiers[0].specs.length;
  const cardsStyle = {
    "--tier-spec-count": specCount,
    "--tier-track-count": specCount + (network ? 6 : 5),
  } as CSSProperties;
  return (
    <div className="cards" style={cardsStyle}>
      {tiers.map((t) => (
        <Card
          role="article"
          key={t.key}
          className={`tier gap-0 py-0 ring-0 ${t.recommended ? "featured" : ""}`}
          id={network ? `network-${t.key}` : undefined}
        >
          <div className={`metal ${t.key}`}>
            {t.recommended && <Badge className="badge">Recommended</Badge>}
          </div>
          <div className="tier-content">
            <span className="eyebrow">
              {network ? "Connectivity hardware package" : "Service package"}
            </span>
            <h3>{t.name}</h3>
            <p>{t.summary}</p>
            <dl>
              {t.specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {network && <p className="small-note">{networkScopeNote}</p>}
            {network && t.designUrl && (
              <a
                className="network-design-link"
                href={t.designUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View {t.name.replace(" Network", "")} network design ↗
              </a>
            )}
            <div className="price">
              <strong>{t.price}</strong>
              <span>
                {network ? "indicative hardware" : "indicative package"}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
