import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { finishRanges } from "../../data";
import { assetUrl } from "../../lib/assets";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";

export function Finishes() {
  const [range, setRange] = useState(finishRanges[0].name as string);
  const [colour, setColour] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const current =
    finishRanges.find((item) => item.name === range) ?? finishRanges[0];
  const move = (direction: number) =>
    setColour(
      (index) =>
        (index + direction + current.colours.length) % current.colours.length,
    );
  return (
    <section className="section" id="finishes" aria-labelledby="finish-title">
      <div className="section-heading">
        <span className="eyebrow">The finishing detail</span>
        <h2 id="finish-title">Switch finishes</h2>
        <p>
          Explore four Clipsal premium ranges for the Platinum package. Other
          ranges can be requested.
        </p>
      </div>
      <Tabs
        value={range}
        onValueChange={(value) => {
          setRange(value);
          setColour(0);
        }}
        className="finish-box"
      >
        <TabsList
          aria-label="Switch finish ranges"
          className="finish-tabs"
          variant="line"
        >
          {finishRanges.map((item) => (
            <TabsTrigger key={item.name} value={item.name}>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {finishRanges.map((item) => (
          <TabsContent key={item.name} value={item.name}>
            <div className="carousel" aria-roledescription="carousel">
              <Button
                variant="outline"
                size="icon"
                aria-label={`Previous ${item.name} colour`}
                onClick={() => move(-1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <figure
                onTouchStart={(event) =>
                  setTouchStart(event.changedTouches[0].clientX)
                }
                onTouchEnd={(event) => {
                  if (touchStart !== null) {
                    const distance =
                      event.changedTouches[0].clientX - touchStart;
                    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
                  }
                  setTouchStart(null);
                }}
              >
                <img
                  src={assetUrl(item.colours[colour % item.colours.length][1])}
                  alt={`Clipsal ${item.name} two-gang switch in ${item.colours[colour % item.colours.length][0]}`}
                  width="420"
                  height="340"
                />
                <figcaption aria-live="polite" aria-atomic="true">
                  {item.name} · {item.colours[colour % item.colours.length][0]}{" "}
                  <span>
                    {colour + 1} / {item.colours.length}
                  </span>
                </figcaption>
              </figure>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Next ${item.name} colour`}
                onClick={() => move(1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </TabsContent>
        ))}
        <p className="small-note">
          Use the arrows or swipe to browse the available two-gang colours.
          Final appearance is confirmed with samples.
        </p>
      </Tabs>
    </section>
  );
}
