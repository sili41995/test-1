import htmlPageString from './html-page-string.js';

async function fetchCatalogs() {
  const catalogs = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlPageString, 'text/html');

  const catalogues = doc.querySelectorAll('.card-catalogue');

  catalogues.forEach((catalogue) => {
    const name = catalogue.querySelector('h3').innerText;
    const url = catalogue.querySelector('figcaption .pdf').href;

    const dates = catalogue.querySelectorAll('time');

    const dateInfo = { start: '', end: '' };

    dates.forEach(({ dateTime }, index) => {
      const isFirstEl = index === 0;
      const isSecondEl = index === 1;

      if (isFirstEl) {
        dateInfo.start = dateTime;
      }

      if (isSecondEl) {
        dateInfo.end = dateTime;
      }
    });

    catalogs.push({ name, link: url, dateInfo });
  });

  const jsonContent = JSON.stringify({ catalogs }, null, 2);
  downloadJSON(jsonContent, 'catalogs.json');

  catalogs.forEach((catalog) => {
    downloadPDF(catalog.link);
  });
}

function downloadJSON(content, fileName) {
  const blob = new Blob([content], { type: 'application/json' });
  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadPDF(url) {
  window.open(url, '_blank');
}

fetchCatalogs();
