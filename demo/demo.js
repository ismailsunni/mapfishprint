import {Map, Overlay, View} from 'ol';

import {
  MFPEncoder,
  BaseCustomizer,
  requestReport,
  getDownloadUrl,
  cancelPrint,
} from '@geoblocks/mapfishprint';
import GPX from 'ol/format/GPX.js';
import KML from 'ol/format/KML.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Circle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Feature from './ol/Feature.js';
import {Polygon, LineString, Point, Circle as CircleGeom} from 'ol/geom.js';
import {getPrintExtent} from './lib/utils.js';
import ImageLayer from 'ol/layer/Image.js';
import CircleStyle from 'ol/style/Circle.js';
import {fromLonLat} from 'ol/proj.js';

const MFP_URL = 'https://geomapfish-demo-2-8.camptocamp.com/printproxy';
const layout = '2 A4 landscape'; // better take from MFP
const pageSize = [254, 675]; // better take from MFP
const getStyleFn = (fillColor) => {
  const fill = new Fill({color: fillColor});
  const stroke = new Stroke({
    color: '#002288',
    width: 1.25,
  });
  return (feature) => {
    return new Style({
      fill,
      stroke,
      text: new Text({
        text: feature.get('name'),
        font: '12px sans-serif',
        offsetY: 12,
      }),
      image: new Circle({
        fill,
        stroke: stroke,
        radius: 5,
      }),
    });
  };
};
const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  style: getStyleFn('rgba(255, 0, 255, 0.4)'),
});
const features = [
  new Feature({
    name: 'A polygon',
    geometry: new Polygon([
      [
        [796612, 5837460],
        [796812, 5837460],
        [796812, 5837260],
        [796612, 5837260],
        [796612, 5837460],
      ],
    ]),
  }),
  new Feature({
    name: 'A Circle',
    geometry: new CircleGeom([796932, 5836860], 75),
  }),
  new Feature({
    name: 'A line',
    geometry: new LineString([
      [796712, 5836960],
      [796712, 5836760],
      [796812, 5836760],
    ]),
  }),
  new Feature({
    name: 'A point',
    geometry: new Point([796612, 5836960]),
  }),
];
features[0].setStyle(getStyleFn('rgba(255,155,50,0.4)'));
features[1].setStyle(getStyleFn('rgba(0,0,0,0.4)'));
// Features 0 and 1 use dedicated style. Feature 2 uses layer style.
vectorLayer.getSource().addFeatures(features);

const wmsLayer = new ImageLayer({
  source: new ImageWMS({
    url: 'https://wms.geo.admin.ch/',
    params: {
      LAYERS: 'ch.astra.wanderland-sperrungen_umleitungen',
      FORMAT: 'image/png',
      CRS: 'EPSG:4326',
      TRANSPARENT: true,
    },
    crossOrigin: 'anonymous',
  }),
});

// KML Layer
const kmlLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/algie.kml',
    format: new KML(),
  }),
});

const gpxStyle = {
  Point: new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: 'rgba(255,0,0,0.4)',
      }),
      radius: 5,
      stroke: new Stroke({
        color: '#f00',
        width: 1,
      }),
    }),
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: '#00f',
      width: 3,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: '#0f0',
      width: 3,
    }),
  }),
};

function hexToRgba(hexValue, alpha = 1.0) {
  return [
    ...hexValue
      .replaceAll('#', '')
      .match(/.{1,2}/g)
      .map((value) => parseInt(value, 16)),
    alpha,
  ];
}

const red = '#f7001d';
const black = '#000000';
const white = '#ffffff';

export const redFill = new Fill({
  color: hexToRgba(red, 0.7),
});

/** Standard line styling */
export const redStroke = new Stroke({
  width: 3,
  color: hexToRgba(red),
});
export const pointStyle = {
  radius: 7,
  stroke: new Stroke({
    color: hexToRgba(black),
  }),
};
export const circleStyle = new Circle({
  ...pointStyle,
  fill: new Fill({
    color: hexToRgba(white),
  }),
});

const gpxStyleGeoAdmin = new Style({
  fill: redFill,
  stroke: redStroke,
  image: circleStyle,
});

const gpxLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/test.gpx',
    format: new GPX(),
  }),
  style: gpxStyleGeoAdmin,
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
    wmsLayer,
    kmlLayer,
    gpxLayer,
  ],
  view: new View({
    center: [796612, 5836960],
    zoom: 12,
  }),
});

// Create an overlay to show the label
const label = document.createElement('div');
label.className = 'label';
label.textContent = 'Hotel';

const overlay = new Overlay({
  element: label,
  position: fromLonLat([7.1531179035150005, 46.354365228570124]), // replace with the longitude and latitude of the hotel
  positioning: 'center-center',
});

// Add the overlay to the map
map.addOverlay(overlay);
let report = null;

document.querySelector('#cancel').addEventListener('click', async () => {
  const resultEl = document.querySelector('#result');
  if (report) {
    const cancelResult = await cancelPrint(MFP_URL, report.ref);
    if (cancelResult.status === 200) {
      resultEl.innerHTML = 'Print is canceled';
    } else {
      resultEl.innerHTML = 'Failed to cancel print';
    }
  } else {
    resultEl.innerHTML = 'No print in progress';
  }
});

document.querySelector('#print').addEventListener('click', async () => {
  console.log('print');
  const specEl = document.querySelector('#spec');
  const reportEl = document.querySelector('#report');
  const resultEl = document.querySelector('#result');
  specEl.innerHTML = reportEl.innerHTML = resultEl.innerHTML = '';
  const encoder = new MFPEncoder(MFP_URL);
  const scale = 50000;
  const center = map.getView().getCenter();
  const customizer = new BaseCustomizer(getPrintExtent(pageSize, center, scale));
  /**
   * @type {MFPMap}
   */
  const mapSpec = await encoder.encodeMap({
    map,
    scale: scale,
    printResolution: map.getView().getResolution(),
    dpi: 254,
    customizer: customizer,
  });

  /**
   * @type {MFPSpec}
   */
  const spec = {
    attributes: {
      map: mapSpec,
      datasource: [],
    },
    format: 'pdf',
    layout: layout,
  };

  // This is just a quick demo
  // Note that using innerHTML is not a good idea in production code...

  console.log('spec', spec);
  specEl.innerHTML = JSON.stringify(spec, null, '  ');

  report = await requestReport(MFP_URL, spec);
  console.log('report', report);
  reportEl.innerHTML = JSON.stringify(report, null, '  ');

  await getDownloadUrl(MFP_URL, report, 1000)
    .then(
      (url) => {
        resultEl.innerHTML = url;
        document.location = url;
        return url;
      },
      (error) => {
        console.log('result', 'error', error);
        resultEl.innerHTML = error;
        return error;
      },
    )
    .finally(() => {
      report = null;
    });
});
