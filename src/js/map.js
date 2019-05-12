var tip = d3
  .tip()
  .attr('class', 'tooltip')
  .offset([-10, 0])
  .html(d => `Country: ${d.properties.name}`);

const worldMap = document.getElementById('world-map');
const { width, height } = worldMap.getBoundingClientRect();

var color = d3
  .scaleThreshold()
  .domain([
    10000,
    100000,
    500000,
    1000000,
    5000000,
    10000000,
    50000000,
    100000000,
    500000000,
    1500000000
  ])
  .range([
    'rgb(247,251,255)',
    'rgb(222,235,247)',
    'rgb(198,219,239)',
    'rgb(158,202,225)',
    'rgb(107,174,214)',
    'rgb(66,146,198)',
    'rgb(33,113,181)',
    'rgb(8,81,156)',
    'rgb(8,48,107)',
    'rgb(3,19,43)'
  ]);

var path = d3.geoPath();

var svg = d3
  .select('svg#world-map')
  .append('g')
  .attr('class', 'map');

var projection = d3
  .geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

path = d3.geoPath().projection(projection);

svg.call(tip);

queue()
  .defer(d3.json, '/src/world/world_countries.json')
  .defer(d3.tsv, '/src/world/world_population.tsv')
  .await(ready);

function ready(error, data, population) {
  var populationById = {};
  const features = data.features;

  population.forEach(function(d) {
    populationById[d.id] = +d.population;
  });
  features.forEach(function(d) {
    d.population = populationById[d.id];
  });

  svg
    .append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('id', d => {
      return `country-${d.id}`;
    })
    .style('fill', function(d) {
      return color(populationById[d.id]);
    })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style('opacity', 0.8)
    // tooltips
    .style('stroke', 'white')
    .style('stroke-width', 0.3)
    .on('mouseover', function(d) {
      tip.show(d);

      d3.select(this)
        .style('opacity', 1)
        .style('stroke', 'white')
        .style('stroke-width', 3);
    })
    .on('mouseout', function(d) {
      tip.hide(d);

      d3.select(this)
        .style('opacity', 0.8)
        .style('stroke', 'white')
        .style('stroke-width', 0.3);
    })
    .on('click', d => {
      showViz(d.id);
      // showAnimation(d.id);
    });
}
