import { assetUrl as asset } from "../lib/assets";
export function ViewerPage() {
  return (
    <main tabIndex={-1} id="main-content" className="viewer-page">
      <div className="section-heading">
        <span className="eyebrow">Explore the home</span>
        <h1>Indicative 3D home viewer</h1>
        <p>
          Draft model from FWD plans rev G. Drag to orbit, scroll to zoom. Use
          the viewer controls to change floor, camera, cutaway and device
          labels.
        </p>
      </div>
      <div className="frame-wrap">
        <iframe
          title="Interactive 3D home viewer"
          src={asset("/viewer/index.html")}
          loading="lazy"
        />
        <p>
          If the interactive view does not load,{" "}
          <a
            href={asset("/viewer/index.html")}
            target="_blank"
            rel="noreferrer"
          >
            open the 3D viewer in a new tab
          </a>
          .
        </p>
      </div>
    </main>
  );
}
