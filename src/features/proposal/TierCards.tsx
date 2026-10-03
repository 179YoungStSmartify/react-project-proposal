import {
  lightingTiers,
  networkTiers,
  integrationScopeNote,
  serviceScopeNote,
  networkScopeNote,
} from "../../data";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
export function TierCards({ network = false }: { network?: boolean }) {
  const tiers = network ? networkTiers : lightingTiers;
  return (
    <div className="cards">
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
            <p className="small-note">
              {network
                ? networkScopeNote
                : `${serviceScopeNote} ${integrationScopeNote}`}
            </p>
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
