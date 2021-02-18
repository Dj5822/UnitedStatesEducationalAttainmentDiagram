// Screen dimensions.
const WIDTH = screen.width-50;
const HEIGHT = screen.height-300;

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
        });

    d3.select("body").append("text").text(JSON.stringify(eduData));
}