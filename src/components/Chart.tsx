/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import {
  stColumnLayer,
  stFoundationLayer,
  stFramingLayer,
  columnsLayer,
  floorsLayer,
  wallsLayer,
  exteriorShellLayer,
  buildingLayer,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import "../App.css";
import {
  buildingLayerCategory,
  construction_status,
  generateChartData,
  generateTotalProgress,
  layerVisibleTrue,
  thousands_separators,
  zoomToLayer,
} from "../Query";
import "@esri/calcite-components/dist/components/calcite-button";
import { CalciteButton } from "@esri/calcite-components-react";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { stations } = use(MyContext);
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState([]);
  const [progress, setProgress] = useState([]);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);

  const chartID = "station-bar";

  useEffect(() => {
    generateChartData(stations).then((response: any) => {
      setChartData(response);
      // zoomToLayer(stFramingLayer);
    });

    generateTotalProgress(stations).then((response: any) => {
      setProgress(response);
    });

    zoomToLayer(stFramingLayer, arcgisScene);

    const resetChartFilterButton = document.querySelector(
      `[id=filterButton]`,
    ) as HTMLDivElement;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !stations
      ? (resetChartFilterButton.hidden = true)
      : (resetChartFilterButton.hidden = false);
  }, [stations]);

  // type
  const types = [
    {
      category: buildingLayerCategory[0],
      value: 1,
    },
    {
      category: buildingLayerCategory[2],
      value: 2,
    },
    {
      category: buildingLayerCategory[1],
      value: 3,
    },
    {
      category: "Roofs",
      value: 4,
    },
    {
      category: buildingLayerCategory[4],
      value: 5,
    },
    {
      category: buildingLayerCategory[5],
      value: 6,
    },
    {
      category: buildingLayerCategory[3],
      value: 7,
    },
    {
      category: "Others",
      value: 8,
    },
  ];

  const sublayerNames = [
    {
      modelName: "StructuralFoundation",
      category: buildingLayerCategory[0],
    },
    {
      modelName: "StructuralFraming",
      category: buildingLayerCategory[1],
    },
    {
      modelName: "StructuralColumns",
      category: buildingLayerCategory[2],
    },
    {
      modelName: "Columns",
      category: buildingLayerCategory[3],
    },
    {
      modelName: "Floors",
      category: buildingLayerCategory[4],
    },
    {
      modelName: "Walls",
      category: buildingLayerCategory[5],
    },
  ];

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;

  const xAxisNumberFormat = "#'%'";
  const seriesBulletLabelFontSize = "1vw";

  // axis label
  const yAxisLabelFontSize = "0.8vw";
  const xAxisLabelFontSize = "0.8vw";
  const legendFontSize = "0.8vw";

  const chartPaddingRightIconLabel = 10;

  const chartSeriesFillColorComp = "#0070ff";
  const chartSeriesFillColorIncomp = "#000000";
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  useEffect(() => {
    exteriorShellLayer.visible = false;
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
    });
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,

        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    yRenderer.labels.template.setAll({
      paddingRight: chartPaddingRightIconLabel,
    });

    yRenderer.grid.template.setAll({
      location: 1,
    });

    // Label properties Y axis
    yAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: yAxisLabelFontSize,
    });

    yAxis.data.setAll(chartData);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: xAxisNumberFormat,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
      }),
    );

    xAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: xAxisLabelFontSize,
    });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 20,
        scale: 0.8,
        layout: root.horizontalLayout,
      }),
    );

    legendRef.current = legend;

    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      fontSize: legendFontSize,
      scale: 1.2,
      marginRight: -50,
      //textDecoration: "underline"
      //fontWeight: '300',
    });

    function makeSeries(name: any, fieldName: any) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          valueXShow: "valueXTotalPercent",
          categoryYField: "category",
          // fill:
          //   fieldName === 'delay'
          //     ? fieldName === 'incomp'
          //       ? am5.color(chartSeriesFillColorIncomp)
          //       : am5.color(chartSeriesFillColorDelay)
          //     : am5.color(chartSeriesFillColorComp),
          fill:
            fieldName === "incomp"
              ? am5.color(chartSeriesFillColorIncomp)
              : am5.color(chartSeriesFillColorComp),
          stroke: am5.color(chartBorderLineColor),
        }),
      );

      series.columns.template.setAll({
        fillOpacity: fieldName === "comp" ? 1 : 0.5,
        tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
        tooltipY: am5.percent(90),
        strokeWidth: chartBorderLineWidth,
      });
      series.data.setAll(chartData);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text:
              fieldName === "comp"
                ? "{valueXTotalPercent.formatNumber('#.')}%"
                : "",
            fill: root.interfaceColors.get("alternativeText"),
            opacity: fieldName === "incomp" ? 0 : 1,
            fontSize: seriesBulletLabelFontSize,
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      // Click event
      // const find = dropdownData.find((emp: any) => emp.name === props.station);
      // const stationValue = find?.value;
      series.columns.template.events.on("click", (ev) => {
        const selected: any = ev.target.dataItem?.dataContext;
        const categorySelect: string = selected.category;
        const find = types.find((emp: any) => emp.category === categorySelect);

        const typeSelect = find?.value;
        const statusSelect: number | null = fieldName === "comp" ? 4 : 1;

        // find sublayer
        const selectedSublayerName = sublayerNames.find(
          (emp: any) => emp.category === categorySelect,
        )?.modelName;

        const expression =
          "Types = " + typeSelect + " AND " + "Status = " + statusSelect;

        const sublayersInvisible = () => {
          if (categorySelect === buildingLayerCategory[0]) {
            stFramingLayer.visible = false;
            stColumnLayer.visible = false;
            columnsLayer.visible = false;
            floorsLayer.visible = false;
            wallsLayer.visible = false;
          } else if (categorySelect === buildingLayerCategory[1]) {
            stFoundationLayer.visible = false;
            stColumnLayer.visible = false;
            columnsLayer.visible = false;
            floorsLayer.visible = false;
            wallsLayer.visible = false;
          } else if (categorySelect === buildingLayerCategory[2]) {
            stFoundationLayer.visible = false;
            stFramingLayer.visible = false;
            columnsLayer.visible = false;
            floorsLayer.visible = false;
            wallsLayer.visible = false;
          } else if (categorySelect === buildingLayerCategory[3]) {
            stFoundationLayer.visible = false;
            stFramingLayer.visible = false;
            stColumnLayer.visible = false;
            floorsLayer.visible = false;
            wallsLayer.visible = false;
          } else if (categorySelect === buildingLayerCategory[4]) {
            stFoundationLayer.visible = false;
            stFramingLayer.visible = false;
            stColumnLayer.visible = false;
            columnsLayer.visible = false;
            wallsLayer.visible = false;
          } else if (categorySelect === buildingLayerCategory[5]) {
            stFoundationLayer.visible = false;
            stFramingLayer.visible = false;
            stColumnLayer.visible = false;
            columnsLayer.visible = false;
            floorsLayer.visible = false;
          }
        };

        // Define query
        arcgisScene?.view
          .whenLayerView(buildingLayer)
          .then((buildingSceneLayerView: any) => {
            layerVisibleTrue();
            const sublayerView = buildingSceneLayerView.sublayerViews.find(
              (sublayerView: any) => {
                return sublayerView.sublayer.modelName === selectedSublayerName;
              },
            );
            setSublayerViewFilter(sublayerView);
            sublayersInvisible();

            if (sublayerView) {
              sublayerView.filter = new FeatureFilter({
                where: expression,
              });
            }

            // const query = sublayerView.createQuery();
            // !sublayerViewFilter
            //   ? (query.where = "Status >= 1")
            //   : (query.where = expression);
            // // query.where = expression;
            // sublayerViewFilter &&
            //   sublayerView.queryFeatures(query).then((results: any) => {
            //     // sublayerView.highlight(results.features);
            //     const lengths = results.features;
            //     const rows = lengths.length;
            //     let objID = [];
            //     for (const i = 0; i < rows; i++) {
            //       const obj = results.features[i].attributes.OBJECTID;
            //       objID.push(obj);
            //     }

            //     sublayerView.filter = new FeatureFilter({
            //       where: expression,
            //     });
            //   });
          });
      });
      legend.data.push(series);
    }
    makeSeries(construction_status[2], "comp");
    makeSeries(construction_status[0], "incomp");
    // makeSeries('Delayed', 'delay');
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });
      layerVisibleTrue();
    }
  }, [resetButtonClicked]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Station_Structures_icon.svg"
          alt="Station Structure Logo"
          height={"60px"}
          width={"60px"}
          style={{ paddingTop: "20px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: "1.2rem",
              marginRight: "20px",
            }}
          >
            TOTAL PROGRESS
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.9rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {progress[2]} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: "1rem",
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(progress[0])})
          </div>
        </dl>
      </div>
      <div
        id={chartID}
        style={{
          width: "100%",
          height: "62vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginTop: "3%",
        }}
      ></div>
      <div
        id="filterButton"
        style={{
          width: "50%",
          marginLeft: "30%",
          paddingTop: "10%",
        }}
      >
        <CalciteButton
          iconEnd="reset"
          onClick={() =>
            setResetButtonClicked(resetButtonClicked === false ? true : false)
          }
        >
          Reset Chart Filter
        </CalciteButton>
      </div>
    </>
  );
};

export default Chart;
