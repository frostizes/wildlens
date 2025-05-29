import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

// Sample polygon (GeoJSON format)
const customPolygons = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Animal Range 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
      [2.5135730322461427, 51.14850617126183],
      [2.6584220719603315, 50.79684804951574],
      [3.123251580425801, 50.780363267614575],
      [3.588184441755658, 50.37899241800358],
      [4.28602298342514, 49.907496649772554],
      [4.799221632515807, 49.98537303323633],
      [5.674051954784829, 49.529483547557504],
      [5.897759230176376, 49.44266714130717],
      [6.186320428094177, 49.463802802114515],
      [6.658229607783709, 49.20195831969157],
      [8.099278598674772, 49.01778351500343],
      [7.593676385131062, 48.33301911070373],
      [7.46675906742223, 47.62058197691181],
      [7.192202182655507, 47.44976552997099],
      [6.736571079138059, 47.54180125588289],
      [6.768713820023634, 47.2877082383037],
      [6.037388950228972, 46.725778713561866],
      [6.022609490593538, 46.27298981382047],
      [6.500099724970454, 46.42967275652944],
      [6.843592970414562, 45.99114655210067],
      [6.802355177445605, 45.70857982032867],
      [7.096652459347837, 45.333098863295874],
      [6.749955275101711, 45.02851797136758],
      [7.007562290076663, 44.25476675066139],
      [7.549596388386163, 44.12790110938482],
      [7.435184767291872, 43.69384491634918],
      [6.529245232783068, 43.12889232031836],
      [4.556962517931396, 43.3996509873116],
      [3.100410597352663, 43.075200507167125],
      [2.985998976258486, 42.47301504166986],
      [1.826793247087181, 42.34338471126569],
      [0.701590610363894, 42.79573436133265],
      [0.338046909190581, 42.579546006839564],
      [-1.502770961910528, 43.03401439063043],
      [-1.901351284177764, 43.42280202897834],
      [-1.384225226232957, 44.02261037859017],
      [-1.193797573237362, 46.014917710954876],
      [-2.225724249673789, 47.06436269793821],
      [-2.963276129559574, 47.570326646507965],
      [-4.491554938159481, 47.95495433205642],
      [-4.592349819344747, 48.68416046812695],
      [-3.295813971357745, 48.90169240985963],
      [-1.616510789384932, 48.644421291694584],
      [-1.933494025063254, 49.776341864615766],
      [-0.98946895995536, 49.347375800160876],
      [1.338761020522753, 50.12717316344526],
      [1.6390010921385, 50.946606350297515],
      [2.5135730322461427, 51.14850617126183]
          ],
        ],
      },
    },
  ],
};

function AnimalMap() {
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  return (
    <>
      <div className="container my-5">
        <div className="card-body p-0">
          <div className="map-responsive" style={{ width: "100%", overflowX: "auto" }}>
            <ComposableMap
              projectionConfig={{ scale: 160 }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup>
                {/* World countries */}
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "#f8f9fa",
                            stroke: "#dee2e6",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: "#0d6efd",
                            outline: "none",
                          },
                          pressed: {
                            fill: "#0b5ed7",
                            outline: "none",
                          },
                        }}
                        onClick={() => {
                          alert(`Clicked: ${geo.properties.NAME}`);
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Custom animal polygons */}
                <Geographies geography={customPolygons}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => (
                      <Geography
                        key={`polygon-${i}`}
                        geography={geo}
                        style={{
                          default: {
                            fill: "rgba(0, 123, 255, 0.3)", // transparent Bootstrap blue
                            stroke: "#0d6efd",
                            strokeWidth: 1,
                            outline: "none",
                          },
                          hover: {
                            fill: "rgba(0, 123, 255, 0.5)",
                            outline: "none",
                          },
                          pressed: {
                            fill: "rgba(0, 123, 255, 0.7)",
                            outline: "none",
                          },
                        }}
                        onClick={() => alert(`Clicked polygon: ${geo.properties.name}`)}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnimalMap;
