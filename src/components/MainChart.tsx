import "@esri/calcite-components/dist/calcite/calcite.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { useEffect, useState } from "react";
import { buildingLayer } from "../layers";

// import LotChart from "./LotChart";
import "../index.css";
import "../App.css";
import Chart from "./Chart";

function MainChart() {
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<any>(); // 'loaded'

  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });
  });

  return (
    <>
      <div
        slot="panel-end"
        // scale="l"
        style={{
          width: "550px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 4,
          borderLeftWidth: 4,
          borderBottomWidth: 4.5,
          borderColor: "#555555",
        }}
      >
        {buildingLayerLoaded === "loaded" ? <Chart /> : ""}
      </div>
    </>
  );
}

export default MainChart;
