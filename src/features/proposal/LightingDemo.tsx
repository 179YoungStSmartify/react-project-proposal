import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";

export function LightingDemo() {
  const [instantOn, setInstantOn] = useState(false);
  const [dimmableOn, setDimmableOn] = useState(false);
  const [brightness, setBrightness] = useState(65);
  return (
    <section className="section demo">
      <span className="eyebrow">Try the interaction</span>
      <h2>Lighting, made simple</h2>
      <p>
        These small demonstrations illustrate the proposed control experience;
        they are not connected to installed hardware.
      </p>
      <div className="demo-grid">
        <div className={`demo-light ${instantOn ? "is-on" : ""}`}>
          <div className="bulb" aria-hidden="true">
            ◉
          </div>
          <h3>Instant on / off</h3>
          <p>Responsive switching at the touch of a button.</p>
          <Button
            aria-label="Toggle instant light"
            aria-pressed={instantOn}
            onClick={() => setInstantOn(!instantOn)}
          >
            {instantOn ? "Turn off" : "Turn on"} instant light
          </Button>
          <output aria-live="polite">{instantOn ? "On" : "Off"}</output>
        </div>
        <div className={`demo-light dim ${dimmableOn ? "is-on" : ""}`}>
          <div
            className="bulb"
            aria-hidden="true"
            style={{ opacity: dimmableOn ? 0.2 + brightness / 125 : 0.35 }}
          >
            ◉
          </div>
          <h3>Gentle dimming</h3>
          <p>
            Platinum dimming is subject to sample-stage testing in your home.
          </p>
          <Button
            aria-label="Toggle dimmable light"
            aria-pressed={dimmableOn}
            onClick={() => setDimmableOn(!dimmableOn)}
          >
            {dimmableOn ? "Turn off" : "Turn on"} dimmable light
          </Button>
          <output aria-live="polite" aria-label="Dimmable light state">
            {dimmableOn ? "On" : "Off"}
          </output>
          <div className="brightness-control">
            <label id="brightness-label">
              Dimmable brightness <span>{brightness}%</span>
            </label>
            <Slider
              aria-label="Dimmable brightness"
              value={[brightness]}
              onValueChange={([value]) => setBrightness(value)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
      <p className="small-note">
        Fade speed is set during commissioning. Any light that does not dim
        smoothly remains simple on/off at no extra cost.
      </p>
    </section>
  );
}
