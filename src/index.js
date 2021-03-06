// Screen dimensions.
const WIDTH = 1000;
const HEIGHT = 620;

// Title and description.
d3.select('body').append('h1').attr("id", "title").text('United States Educational Attainment');
d3.select('body').append('h3').attr("id", "description").text("Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)");

// SVG
const svg = d3.select("body").append("svg").attr("width", WIDTH).attr("height", HEIGHT);
var path = d3.geoPath();

// File locations
const COUNTY_FILE = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const EDUCATION_FILE = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

// Retrieve data
d3.queue()
    .defer(d3.json, COUNTY_FILE)
    .defer(d3.json, EDUCATION_FILE)
    .await(ready);

// Returns the color corresponding to the education level. 
var eduColor = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9]);

// Scale used for the legend.
var xScale = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

// Used create and format the legend.
var legend = svg
  .append('g')
  .attr('class', 'key')
  .attr('id', 'legend')
  .attr('transform', 'translate(0,40)');

legend.selectAll("rect").data(d3.range(3, 66, (66 - 3) / 7)).enter().append("rect")
  .attr("width", 33)
  .attr("height", 10)
  .attr("x", (d, i) => xScale(d))
  .attr("y", 0)
  .style("fill", (d, i) => eduColor(d));

legend.call(
    d3.axisBottom(xScale)
        .tickSize(13)
        .tickFormat(function (xScale) {
        return Math.round(xScale) + '%';
        })
        .tickValues(eduColor.domain())
    )
    .select('.domain')
    .remove();

// tooltip
var tooltip = d3.select('body').append('div')
    .attr("id", "tooltip")
    .style("height", "30px")
    .style("opacity", 0)
    .attr("data-education", "")
    .style("left", WIDTH - 100 + "px")
    .style("top", "0px");

var eduText = tooltip.append("text").text("");

function ready(error, mapData, eduData) {
    if (error) {
        throw error;
    }

    // Map data
    var geojson = topojson.feature(mapData, mapData.objects.counties);

    svg.selectAll('path').data(geojson.features)
        .enter().append('path')
        .attr("class", "county")
        .attr('d', path)
        .attr("data-fips", (d) => d.id)
        .attr("data-education", (d) => {
            var result = eduData.filter(function (obj) {
                return obj.fips == d.id;
            })

            if (result[0]) {
                return result[0].bachelorsOrHigher;
            }
            else {
                console.log("could not find data for ", d.id);
                return 0;
            }
        })
        .style("fill", (d) => {
            var result = eduData.filter(function (obj) {
                return obj.fips == d.id;
            })

            if (result[0]) {
                return eduColor(result[0].bachelorsOrHigher);
            }
            else {
                console.log("could not find data for ", d.id);
                return "white";
            }
        })
        .on("mouseover", (d, i) => {
            tooltip.style("opacity", 1)
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
            
            var result = eduData.filter(function (obj) {
                return obj.fips == d.id;
            })

            if (result[0]) {
                eduText.text(result[0].area_name + ", " + result[0].state + ": " + result[0].bachelorsOrHigher + "%");
                tooltip.attr("data-education", result[0].bachelorsOrHigher)
            }
        })
        .on("mouseout", (d, i) => {
            tooltip.style("opacity", 0);
            tooltip.style("left", WIDTH - 100 + "px")
                .style("top", "0px");
        });   
}