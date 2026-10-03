import { comparisonRows, lightingTiers, networkTiers } from "../../data";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "../../components/ui/table";
export function ComparisonTable() {
  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">Side by side</span>
        <h2>What each tier includes</h2>
      </div>
      <div
        className="table-wrap"
        tabIndex={0}
        aria-label="Scrollable package comparison"
      >
        <Table>
          <TableCaption>
            Lighting packages; network hardware is quoted separately. All prices
            are indicative.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Capability</TableHead>
              {lightingTiers.map((t) => (
                <TableHead key={t.key}>{t.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonRows.map(([label, ...values]) => (
              <TableRow key={label}>
                <TableHead scope="row">{label}</TableHead>
                {values.map((value, index) => (
                  <TableCell key={index}>
                    {label === "Home network" ? (
                      <a href={`#/?section=network-${networkTiers[index].key}`}>
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
