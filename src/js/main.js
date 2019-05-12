function init() {
  addListeners();
  const countries = [
    'ARG',
    'AUT',
    'BEL',
    'CAN',
    'CHN',
    'CIV',
    'CYP',
    'DEU',
    'FIN',
    'GBR',
    'IND',
    'IRL',
    'ISR',
    'ITA',
    'JAM',
    'JPN',
    'LKA',
    'LTU',
    'LUX',
    'MEX',
    'MYS',
    'NGA',
    'NZL',
    'PAN',
    'PHL',
    'PRT',
    'SGP',
    'SVN',
    'SWE',
    'TUR',
    'USA',
    'ZAF'
  ];
  countries.forEach((country, index) => {
    updateCountryOnMap(country);
    updateCountryList(country, index);
  });
}
setTimeout(() => init(), 1000);

function updateCountryOnMap(code) {
  const country = document.getElementById(`country-${code}`);

  if (country) {
    country.style.fill = 'green';
  }
}

function updateCountryList(code, index) {
  const list = document.getElementById('country-list');
  const node = document.createElement('LI');
  const country = countryCodes.find(c => c['alpha-3'] === code);
  const textnode = document.createTextNode(`${index + 1}) ${country['name']}`);

  node.setAttribute('class', 'list__item');
  node.setAttribute('id', code);
  node.appendChild(textnode);
  list.appendChild(node);
}

function addListeners() {
  const list = document.getElementById('country-list');
  list.addEventListener('click', event => {
    const country = event.target.id;

    toggleModal('block');
    showViz(country);
  });
}

function toggleModal(display) {
  // const modal = document.getElementById('modal');
  // modal.style.display = display;
}

function writeInformation(id, website) {
  document.getElementById(`${id}__information`).innerHTML = `${
    website.hostname
  }, ${website.thirdParties.length + 1} third parties`;
  document.getElementById(`${id}__title`).innerHTML = id.toUpperCase();
}

function initViz(websites) {
  const nodes = [];
  let links = [];
  for (const website in websites) {
    const site = websites[website];
    if (site.thirdParties) {
      const thirdPartyLinks = site.thirdParties.map(thirdParty => {
        return {
          source: website,
          target: thirdParty
        };
      });
      links = links.concat(thirdPartyLinks);
    }
    nodes.push(websites[website]);
  }

  return { nodes, links };
}

async function process(websites, type, value) {
  const { nodes, links } = initViz(websites);
  const website = nodes.find(
    node => node.firstParty && node.thirdParties.length > 1
  );
  const to = await getLocationOfHostname(website.hostname);

  clearCanvas(type);
  const newViz = { ...viz };
  newViz.init(nodes, links, type);
  showLines(value, to);

  website.thirdParties.forEach(async thirdParty => {
    const to = await getLocationOfHostname(website.hostname);
    showLines(value, to);
  });

  writeInformation(type, website);
}

async function showViz(value) {
  const country = value.toLowerCase();
  const id = document.getElementById(`country-${value}`);

  if (id && id.style.fill === 'green') {
    d3.json(`/lightbeam-import/data/${country}-mobile.json`, websites => {
      process(websites, 'mobile', value);
    });

    d3.json(`/lightbeam-import/data/${country}-news.json`, websites => {
      process(websites, 'news', value);
    });
  } else {
    alert('Please select another country');
  }
}

function showLines(country1, country2) {
  const from = document.getElementById(`country-${country1}`);
  const to = document.getElementById(`country-${country2}`);
  const svg = document.getElementById('world-map');
  const { x, y } = svg.getBoundingClientRect();
  const { x: x1, y: y1 } = from.getBoundingClientRect();
  const { x: x2, y: y2 } = to.getBoundingClientRect();
  // console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`);

  drawLine(x1 - x, y1 - y, x2 - x, y2 - y);
}

function drawLine(x1, y1, x2, y2) {
  const svg = document.getElementById('world-map');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

  line.setAttribute('class', 'lines');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', 'red');

  svg.append(line);
}

async function getLocationOfHostname(hostname) {
  const data = await fetch(
    `http://api.ipstack.com/${hostname}?access_key=9d992bbcaa0b1134cf51945ba793a340&hostname=1&output=json`
  );
  const response = await data.json();
  const { country_code, country_name } = response;
  const country = countryCodes.find(code => code['alpha-2'] === country_code);

  return country['alpha-3'];
}

function clearCanvas1() {
  const parent = document.getElementById('visualization');
  const child = document.getElementById('canvas1');

  child && parent.removeChild(child);
}

function clearCanvas(type) {
  const parent = document.getElementById(`visualization-${type}`);
  const child = document.getElementById(`canvas-${type}`);

  child && parent.removeChild(child);
}
