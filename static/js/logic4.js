// Creating map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
let countyLink = "static/data/countyfips.geojson";
let stateLink = "static/data/statefips.geojson";
// Use this link to get the sql data.
let countyDataURL = "http://127.0.0.1:5000/api/v1.0/county"
console.log(countyDataURL)

fetch(countyDataURL)
.then(response => response.text())
.then((countyData) => {
    console.log(countyData)
})
.catch(err => console.log(err))

////////////////////////////////////////
//              To Do
// Loop edata_county
////////////////////////////////////////
// Function that will determine the color of a county based on the Party
function chooseColor(county) {
  switch (county) {
  case "democrat":
    return "blue";
  case "republican":
    return "red";
  default:
    return "black";
  }
}
// function fipsMatch(stateFips,countyFips){
// // lloopps
// for (let i = 0; i < countyData.length; i++) {
//   if (countyData.countyfips == countyFips & countyData.statefips == stateFips & countyData.year == 2016)
//   { if (countyData.percentage >50 & countyData.party == "republican")
//     return(
//       {
//         color: "white",
//         // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
//         fillColor: "red",
//         fillOpacity: 0.5,
//         weight: 1.5})
//       else {
//         return({
//         color: "white",
//         fillColor: "blue",
//         fillOpacity: 0.5,
//         weight: 1.5})
//         }
//   }
// compare who won countyData.percentage > 50


// case wehn party = repub
// return {
// color: "white",
// // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
// fillColor: red ,
// fillOpacity: 0.5,
// weight: 1.5}

// case wehn party = democ
// return {
// color: "white",
// // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
// fillColor: blue ,
// fillOpacity: 0.5,
// weight: 1.5}
// }

// Grabbing our GeoJSON data..
d3.json(stateLink, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature){
      // return 
      //  fipsMatch(features.properties.state,features.properties.county)
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "red",  //chooseColor(feature.properties.county),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

    }
  }).addTo(myMap);
});
