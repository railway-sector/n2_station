import { useEffect } from "react";
import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteButton } from "@esri/calcite-components-react";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

function ViewRotateButton() {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  useEffect(() => {
    // Look around animation
    let abort: any = false;
    let center: any = null;
    const play = document.querySelector(`[id=play]`) as HTMLDivElement;
    const pause = document.querySelector(`[id=pause]`) as HTMLDivElement;

    arcgisScene?.view.when(() => {
      arcgisScene?.view.ui.add(play, "top-right");
      arcgisScene?.view.ui.add(pause, "top-right");
    });

    const rotate = () => {
      if (!arcgisScene?.view.interacting && !abort) {
        play.style.display = "none";
        pause.style.display = "block";
        center = center || arcgisScene?.view.center;
        arcgisScene?.view.goTo(
          {
            heading: arcgisScene?.view.camera.heading + 0.2,
            center,
          },
          { animate: false },
        );
        requestAnimationFrame(rotate);
      } else {
        abort = false;
        center = null;
        play.style.display = "block";
        pause.style.display = "none";
      }
    }; // end
    if (play) {
      play.onclick = rotate;
      pause.onclick = function () {
        abort = true;
      };
    }
  });

  return (
    <>
      <CalciteButton iconEnd="play" id="play"></CalciteButton>
      <CalciteButton
        iconEnd="pause"
        id="pause"
        style={{ display: "none" }}
      ></CalciteButton>
    </>
  );
}

export default ViewRotateButton;
