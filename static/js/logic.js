///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. Change colors to red, blue
///////////////////////////////////////////////

function getColor(depth){
    if (depth <=10){
      return '#a3f600'
    }
    if (depth <=30){
      return '#dcf400'
    }
    if (depth <=50){
      return '#f7da08'
    }
    if (depth <=70){
      return '#fdb72a'
    }
    if (depth <=90){
      return '#fca35d'
    }
    if (depth > 90){
      return '#ff5f65'
    }
}
///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. Update "queryUrl" to county and duplicate for state 
///////////////////////////////////////////////

  // Store our API endpoint inside queryUrl
let queryUrl = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});

///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. change "earthquakeData" to "county_data"
///////////////////////////////////////////////

function createFeatures(earthquakeData) { 

///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. Update "layer" to include the FIPS MAPBOX
///////////////////////////////////////////////

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) +
    "</h3><hr><p>" + "Magnitude: " + feature.properties.mag +
    "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2]+ "</p>");
}
console.log(earthquakeData);

///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. change latlng to FIPS - somehow
///////////////////////////////////////////////

function pointToLayer(feature, latlng){
    let circle = L.circleMarker(latlng, {
      fillOpacity: 1,
      radius: feature.properties.mag * 3,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: 'darkgreen',
      weight: .5
// Added circle outline and weight so colors stood out
    });
  return circle
}

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: pointToLayer
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});
  
let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

let satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.satellite',
  accessToken: API_KEY
});


// Define a baseMaps object to hold our base layers
let baseMaps = {
  "Light Map": lightmap,
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite": satellite
};

///////////////////////////////////////////////
//                PROJ 2 TO DO:
// 1. Here is where we will add 2004, 2008, 2012, 2016 OR 
// 2. Here is where we will add county, state, flips
///////////////////////////////////////////////

// Create overlay object to hold our overlay layer
let overlayMaps = {
  Earthquakes: earthquakes
  
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [lightmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

let legend = L.control({position: 'bottomright'});
legend.onAdd = function(map){

let div = L.DomUtil.create("div", 'info legend'),

  depth = [0, 10, 30, 50, 70, 90],
  color = ['#a3f600', '#dcf400', '#f7da08', '#fdb72a', '#fca35d', '#ff5f65'],
  labels = ['<strong> EARTHQUAKE DEPTH </strong>'],
  from, to;

  for (let i = 0; i<depth.length; i++){
    div.innerHTML +=
    '<i style="background:' + color[i] + '"></i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');    
  }
  // div.innerHTML = labels.join('<br>'); HOW DO I ADD THE LEGEND TITLE
  return div;

  };
  
legend.addTo(myMap);
}



