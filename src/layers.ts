import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  SimpleMarkerSymbol,
  LabelSymbol3D,
  TextSymbol3DLayer,
  SimpleLineSymbol,
  MeshSymbol3D,
  FillSymbol3DLayer,
} from "@arcgis/core/symbols";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});
/* Chainage Layer  */
const labelChainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: {
      size: 15,
      weight: "bold",
    },
  },
});

const chainageRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: {
      width: 0.2,
      color: "black",
    },
  }),
});

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
  labelingInfo: [labelChainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainageRenderer,
  popupEnabled: false,
});

// * Pier No layer * //
const pierNoLabelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "white",
        },
        size: 10,
        halo: {
          color: "black",
          size: 1,
        },
        font: {
          family: "Ubuntu Mono",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 40,
      maxWorldLength: 100,
      minWorldLength: 20,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.PIER",
    //value: "{TEXTSTRING}"
  },
});

export const pierNoLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/6",
  labelingInfo: [pierNoLabelClass],
  elevationInfo: {
    mode: "on-the-ground", //absolute-height, relative-to-ground
  },
  title: "Pier No",
  popupEnabled: false,
});

// * PROW *//
const prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  title: "ROW",
  definitionExpression: "Extension = 'N2'",
  popupEnabled: false,
  renderer: prowRenderer,
});

// * Station Layer * //
const stationLayerTextSymbol = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 13,
        halo: {
          color: "black",
          size: 0.5,
        },
        font: {
          family: "Ubuntu Mono",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 70,
      maxWorldLength: 100,
      minWorldLength: 50,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Station",
  labelingInfo: [stationLayerTextSymbol],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* Building Scene Layer for station structures */
export const buildingLayer = new BuildingSceneLayer({
  portalItem: {
    id: "a1f0981f5fac47c5b1d1e8ca80abc118",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  outFields: ["Category", "Status", "BldgLevel", "StructureLevel", "Types"],
  title: "Station Structures",
  legendEnabled: false,
});

// Discipline: Architectural
export let columnsLayer: null | any;
export let floorsLayer: null | any;
export let wallsLayer: null | any;

// Discipline: Structural
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;

export let exteriorShellLayer: null | any;

export const popuTemplate = {
  title: "{Station}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "Status",
          label: "Construction Status",
        },
        {
          fieldName: "Category",
          label: "Category",
        },
        {
          fieldName: "Status",
          label: "Construction Status",
        },
        {
          fieldName: "BldgLevel",
          label: "Building Level",
        },
      ],
    },
  ],
};

const colorStatus = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [211, 211, 211, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

const renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 2,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[1],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 4,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

// for (const i = 0; i < colorStatus.length; i++) {
//   renderer.addUniqueValueInfo({
//     value: i + 1,
//     symbol: new MeshSymbol3D({
//       symbolLayers: [
//         new FillSymbol3DLayer({
//           material: {
//             color: colorStatus[3],
//             colorMixMode: 'replace',
//           },
//           edges: new SolidEdges3D({
//             color: [225, 225, 225, 0.3],
//           }),
//         }),
//       ],
//     }),
//   });
// }

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        break;

      case "Columns":
        columnsLayer = layer;
        columnsLayer.popupTemplate = popuTemplate;
        columnsLayer.renderer = renderer;
        //excludedLayers.push(layer);
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = popuTemplate;
        floorsLayer.renderer = renderer;
        //excludedLayers
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = popuTemplate;
        wallsLayer.renderer = renderer;
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = popuTemplate;
        stFramingLayer.renderer = renderer;
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = popuTemplate;
        stColumnLayer.renderer = renderer;
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = popuTemplate;
        stFoundationLayer.renderer = renderer;
        break;

      default:
        layer.visible = true;
    }
  });
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [chainageLayer, pierNoLayer, prowLayer], //stationLayer,
});
