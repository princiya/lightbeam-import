async function init() {
  addListeners();
  const countries = await importData();
  countries.forEach(country => {
    updateCountryOnMap(country);
    updateCountryList(country);
  });
}
setTimeout(() => init(), 1000);

function updateCountryOnMap(code) {
  const country = document.getElementsByClassName(`country-${code}`)[0];
  country.style.fill = 'red';
}

function updateCountryList(country) {
  const list = document.getElementById('country-list');
  const node = document.createElement('LI');
  const textnode = document.createTextNode(country);
  node.appendChild(textnode);
  list.appendChild(node);
}

function upload() {
  const country = document.getElementById('country-input').value;

  if (!country) {
    alert('Please enter a valid country code');
    return;
  }

  updateCountryOnMap(country);
  updateCountryList(country);
}

function addListeners() {
  const list = document.getElementById('country-list');
  list.addEventListener('click', event => {
    const country = event.target.textContent;
    toggleModal('block');
    showViz(country);
  });
}

function toggleModal(display) {
  const modal = document.getElementById('modal');
  modal.style.display = display;
}

function showViz(value) {
  const country = value.toLowerCase();
  queue()
    .defer(d3.json, `${country}.json`)
    .await((error, websites) => {
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

      viz.init(nodes, links);
    });
}

async function importData() {
  const response = await fetch('/import');
  return await response.json();
}
