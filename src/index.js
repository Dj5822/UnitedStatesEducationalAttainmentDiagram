const WIDTH = screen.width;
const HEIGHT = screen.height;

d3.select('body').append('h1').attr("id", "title").text('United States Educational Attainment');
d3.select('body').append('h3').attr("id", "description").text("Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)");

// US Educational Data
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    .then(response => response.json())
    .then(data => {
        d3.select("body").append("text").text(JSON.stringify(data));
    });

// US County Data
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    .then(response => response.json())
    .then(data => {
        d3.select("body").append("text").text(JSON.stringify(data));
    });