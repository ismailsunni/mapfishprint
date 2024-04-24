import {requestReport, getDownloadUrl, cancelPrint} from '@geoblocks/mapfishprint';

// const MFP_URL = 'https://geomapfish-demo-2-8.camptocamp.com/printproxy';
let MFP_URL = 'https://sys-map.dev.bgdi.ch/api/print3/print/mapviewer';

let report = null;

document.querySelector('#cancel').addEventListener('click', async () => {
  const resultEl = document.querySelector('#result');
  const mfpUrlEl = document.querySelector('#mfpURL');

  if (report) {
    if (mfpUrlEl.value) {
      MFP_URL = mfpUrlEl.value;
    }
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
  const mfpUrlEl = document.querySelector('#mfpURL');
  const specEl = document.querySelector('#spec');
  const reportEl = document.querySelector('#report');
  const resultEl = document.querySelector('#result');

  reportEl.innerHTML = 'Loading...';
  resultEl.innerHTML = 'Loading...';

  if (mfpUrlEl.value) {
    MFP_URL = mfpUrlEl.value;
  } else {
    mfpUrlEl.innerHTML = MFP_URL;
  }

  /**
   * @type {MFPSpec}
   */
  let spec = {
    format: 'pdf',
    layout: '1. A4 landscape',
    attributes: {
      map: {
        center: [2600000, 1200000],
        dpi: 96,
        layers: [
          {
            baseURL:
              'https://sys-wmts.dev.bgdi.ch/1.0.0/ch.vbs.waldschadenkarte/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.png',
            imageFormat: 'image/png',
            requestEncoding: 'REST',
            layer: 'ch.vbs.waldschadenkarte',
            type: 'WMTS',
            style: 'ch.vbs.waldschadenkarte',
            matrixSet: '2056_26',
            matrices: [
              {
                identifier: 0,
                scaleDenominator: 14285714.285714287,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 1,
                scaleDenominator: 13392857.142857144,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 2,
                scaleDenominator: 12500000.000000002,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 3,
                scaleDenominator: 11607142.857142858,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 4,
                scaleDenominator: 10714285.714285715,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 5,
                scaleDenominator: 9821428.571428573,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 6,
                scaleDenominator: 8928571.42857143,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 7,
                scaleDenominator: 8035714.285714286,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 8,
                scaleDenominator: 7142857.142857144,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1, 1],
              },
              {
                identifier: 9,
                scaleDenominator: 6250000.000000001,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [2, 1],
              },
              {
                identifier: 10,
                scaleDenominator: 5357142.857142857,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [2, 1],
              },
              {
                identifier: 11,
                scaleDenominator: 4464285.714285715,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [2, 1],
              },
              {
                identifier: 12,
                scaleDenominator: 3571428.571428572,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [2, 2],
              },
              {
                identifier: 13,
                scaleDenominator: 2678571.4285714286,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [3, 2],
              },
              {
                identifier: 14,
                scaleDenominator: 2321428.571428572,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [3, 2],
              },
              {
                identifier: 15,
                scaleDenominator: 1785714.285714286,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [4, 3],
              },
              {
                identifier: 16,
                scaleDenominator: 892857.142857143,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [8, 5],
              },
              {
                identifier: 17,
                scaleDenominator: 357142.85714285716,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [19, 13],
              },
              {
                identifier: 18,
                scaleDenominator: 178571.42857142858,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [38, 25],
              },
              {
                identifier: 19,
                scaleDenominator: 71428.57142857143,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [94, 63],
              },
              {
                identifier: 20,
                scaleDenominator: 35714.28571428572,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [188, 125],
              },
              {
                identifier: 21,
                scaleDenominator: 17857.14285714286,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [375, 250],
              },
              {
                identifier: 22,
                scaleDenominator: 8928.57142857143,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [750, 500],
              },
              {
                identifier: 23,
                scaleDenominator: 7142.857142857143,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [938, 625],
              },
              {
                identifier: 24,
                scaleDenominator: 5357.142857142858,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1250, 834],
              },
              {
                identifier: 25,
                scaleDenominator: 3571.4285714285716,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [1875, 1250],
              },
              {
                identifier: 26,
                scaleDenominator: 1785.7142857142858,
                topLeftCorner: [2420000.0, 1350000.0],
                tileSize: [256, 256],
                matrixSize: [3750, 2500],
              },
            ],
          },
        ],
        projection: 'EPSG:2056',
        rotation: 0,
        scale: 500000,
      },
      legend: {
        name: '',
        classes: [
          {
            name: 'Hausnummer und Sachplan',
            icons: [
              'https://sys-api3.dev.bgdi.ch/static/images/legends/ch.swisstopo.amtliches-gebaeudeadressverzeichnis_de.png',
              'https://sys-api3.dev.bgdi.ch/static/images/legends/ch.bfe.sachplan-uebertragungsleitungen_kraft_de.png',
            ],
          },
        ],
      },
      name: 'Test less simple report',
      qrimage: 'https://sys-map.dev.bgdi.ch/api/qrcode/generate?url=https://s.geo.admin.ch/jgomwqlylah8',
      copyright: '© swisstopo, swisstopo & FGS',
      url: 'https://map.geo.admin.ch',
    },
  };

  // This is just a quick demo
  // Note that using innerHTML is not a good idea in production code...
  console.log(specEl.value);
  if (specEl.value) {
    spec = JSON.parse(specEl.value);
  }
  console.log('spec', spec);

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
