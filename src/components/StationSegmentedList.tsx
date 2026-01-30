import { useState, use } from "react";
import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";

import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
} from "@esri/calcite-components-react";

import { station_names } from "../Query";
import { MyContext } from "../contexts/MyContext";

export default function StationSegmentedList() {
  const { updateStations } = use(MyContext);
  const [stationSelected, setStationSelected] = useState<string>(
    station_names[0],
  );

  return (
    <>
      <CalciteSegmentedControl
        onCalciteSegmentedControlChange={(event: any) => {
          setStationSelected(event.target.selectedItem.id);
          updateStations(event.target.selectedItem.id);
        }}
        scale="m"
        width="full"
      >
        {stationSelected &&
          station_names.map((station: any, index: any) => {
            return (
              <CalciteSegmentedControlItem
                {...(stationSelected === station ? { checked: true } : {})}
                key={index}
                value={station}
                id={station}
              >
                {station}
              </CalciteSegmentedControlItem>
            );
          })}
      </CalciteSegmentedControl>
    </>
  );
}
