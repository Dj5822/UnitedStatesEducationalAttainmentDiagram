const WIDTH = screen.width-50;
const HEIGHT = screen.height-300;

d3.select('body').append('h1').attr("id", "title").text('United States Educational Attainment');
d3.select('body').append('h3').attr("id", "description").text("Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)");

var path = d3.geoPath();

const svg = d3.select("body").append("svg").attr("width", WIDTH).attr("height", HEIGHT);

var path = d3.geoPath();

// US County Data
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    .then(response => response.json())
    .then(data => {

        var geojson = topojson.feature(data, data.objects.counties);

        svg.selectAll('path').data(geojson.features)
            .enter().append('path').attr('d', path)
            .style("fill", "green");

        d3.select("body").append("text").text(JSON.stringify(data.objects.counties));
    });

// US Educational Data
/*
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    .then(response => response.json())
    .then(data => {
        d3.select("body").append("text").text(JSON.stringify(data));
    });
*/