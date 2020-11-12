// Creating map object
let myMap = L.map("map", {
  center: [38.65, -96.71],
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

function stateMap() {

  let countyLink = "static/data/countyfips.geojson";
  let stateLink = "static/data/statefips.geojson";
  // Use this link to get the sql data.
  let countyDataURL = "http://127.0.0.1:5000/api/v1.0/county"
  let stateDataURL = "http://127.0.0.1:5000/api/v1.0/state"

  fetch(stateDataURL)
    .then(response => response.json())
    .then((countyData) => {
      console.log(countyData)
      geoMapIt(countyData)
    })
    .catch(err => console.log(err))

  function fipsMatch(stateFips, countyFips, countyData) {
    console.log("county data length", countyData.length)

    for (let i = 0; i < countyData.length; i++) {
      console.log("county", i, countyData.length)
      if (countyData[i].statefips === stateFips) {
        if (countyData[i].percentage >= 50 & countyData[i].party == "republican") {
          console.log("party", countyData[i].party)
          console.log("percentage", countyData[i].percentage)
          return (
            {
              color: "white",
              fillColor: "red",
              fillOpacity: 0.5,
              weight: 1.5
            })
        }
        if (countyData[i].percentage >= 50 & countyData[i].party == "democrat") {
          return ({
            color: "white",
            fillColor: "blue",
            fillOpacity: 0.5,
            weight: 1.5
          })
        }
      }
    }
  }

  function fipsMatch(stateFips, countyFips, countyData) {
    console.log("county data length", countyData.length)

    for (let i = 0; i < countyData.length; i++) {
      console.log("county", i, countyData.length)
      if (countyData[i].countyfips === countyFips && countyData[i].statefips === stateFips) {
        if (countyData[i].percentage >= 50 & countyData[i].party == "republican") {
          console.log("party", countyData[i].party)
          console.log("percentage", countyData[i].percentage)

          return (
            {
              color: "white",
              fillColor: "red",
              fillOpacity: 0.5,
              weight: 1.5
            })
        }
        if (countyData[i].percentage >= 50 & countyData[i].party == "democrat") {
          console.log("party", countyData[i].party)
          console.log("percentage", countyData[i].percentage)

          return (
            {
              color: "white",
              fillColor: "blue",
              fillOpacity: 0.5,
              weight: 1.5
            })
        }
      }
    }
  }






  
  function geoMapIt(countyData) {
    // Grabbing our GeoJSON data..
    d3.json(stateLink, function (data) {
      // Creating a geoJSON layer with the retrieved data
      L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        style: function (feature) {
          // return 
          //  fipsMatch(features.properties.state,features.properties.county)
          //{
          if (feature.properties.STATE === "04" || feature.properties.STATE === "12" || feature.properties.STATE === "26" || feature.properties.STATE === "42" || feature.properties.STATE === "37") {
            return fipsMatch(feature.properties.STATE, feature.properties.COUNTY, countyData)
          }
          else {
            return {
              color: "white",
              // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
              fillColor: "black",  //chooseColor(feature.properties.county),
              fillOpacity: 0.5,
              weight: 1.5
            }
          }
        },
        // Called on each feature
        onEachFeature: function (feature, layer) {
          // Set mouse events to change map styling
          layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
            // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
            click: function (event) {
              myMap.fitBounds(event.target.getBounds({
                zoom: 1
              }));
            }
          });
          // Giving each feature a pop-up with information pertinent to it
          layer.bindPopup("<h1>" + feature.properties.NAME + "</h1>");

        }
      }).addTo(myMap);
    })
  }}

















  function flipsMap (){
    let countyLink = "static/data/countyfips.geojson";
    let stateLink = "static/data/statefips.geojson";
    // Use this link to get the sql data.
    let countyDataURL = "http://127.0.0.1:5000/api/v1.0/county"
    let stateDataURL = "http://127.0.0.1:5000/api/v1.0/state"

    fetch(countyDataURL)
      .then(response => response.json())
      .then((countyData) => {
        console.log(countyData)
        // console.log("firstlength", countyData[0])
        // Need if statement where if overlay is clicked for state, then maps state
        geoMapIt(countyData)
      })
      .catch(err => console.log(err))

    function fipsMatch(stateFips, countyFips,countyData) {
      console.log("county data length", countyData.length)

      for (let i = 0; i < countyData.length; i++) {
        console.log("county", i, countyData.length)
        if (countyData[i].countyfips === countyFips && countyData[i].statefips === stateFips ) {
          if (countyData[i].percentage >= 50 & countyData[i].party == "republican" & countyData[i].flips === 0) {
            console.log("party",countyData[i].party)
            console.log("percentage",countyData[i].percentage)
            console.log("flips",countyData[i].flips)
            return (
              {
                color: "black",
                fillColor: "black",
                fillOpacity: 0.5,
                weight: 1.5
              })}
          if (countyData[i].percentage >= 50 & countyData[i].party == "republican" & countyData[i].flips === 1) {
            console.log("party",countyData[i].party)
            console.log("percentage",countyData[i].percentage)
            console.log("flips",countyData[i].flips)
            return (
              {
              color: "black",
              fillColor: "red",
              fillOpacity: 0.5,
              weight: 1.5
              })}
          if (countyData[i].percentage >= 50 & countyData[i].party == "democrat" & countyData[i].flips === 0) {
            console.log("party",countyData[i].party)
            console.log("percentage",countyData[i].percentage)
            console.log("flips",countyData[i].flips)
            return (
              {
              color: "black",
              fillColor: "black",
              fillOpacity: 0.5,
              weight: 1.5
              })}    
          if (countyData[i].percentage >= 50 & countyData[i].party == "democrat" & countyData[i].flips === 1) {
            console.log("party",countyData[i].party)
            console.log("percentage",countyData[i].percentage)
            console.log("flips",countyData[i].flips)
            return (
              {
              color: "black",
              fillColor: "blue",
              fillOpacity: 0.5,
              weight: 1.5
              })}
        }
      }
    }


    function geoMapIt(countyData) {
      // Grabbing our GeoJSON data..
      d3.json(countyLink, function (data) {
        // Creating a geoJSON layer with the retrieved data
        L.geoJson(data, {
          // Style each feature (in this case a neighborhood)
          style: function (feature) {
            // return 
            //  fipsMatch(features.properties.state,features.properties.county)
            //{
            if (feature.properties.STATE === "04" || feature.properties.STATE === "12"  || feature.properties.STATE === "26" || feature.properties.STATE === "42" || feature.properties.STATE === "37") {
            return fipsMatch(feature.properties.STATE, feature.properties.COUNTY,countyData)
            }
            else {
            return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: "black",  //chooseColor(feature.properties.county),
            fillOpacity: 0.5,
            weight: 1.5
            }}

          },
          // Called on each feature
          onEachFeature: function (feature, layer) {
            // Set mouse events to change map styling
            layer.on({
              // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
              mouseover: function (event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.9
                });
              },
              // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
              mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
              },
              // When a feature (party) is clicked, it is enlarged to fit the screen
              click: function (event) {
                myMap.fitBounds(event.target.getBounds());
              }
            });
            // Giving each feature a pop-up with information pertinent to it
            // layer.bindPopup("<h1>" + feature.properties.PARTY + "</h1> <hr> <h2>" + feature.properties.PERCENTAGE + "</h2>");
            layer.bindPopup("<h1>" + feature.properties.NAME + "</h1>");
          }
        }).addTo(myMap);
      })
    }


  }

















  function countyMap () {

    let countyLink = "static/data/countyfips.geojson";
    let stateLink = "static/data/statefips.geojson";
    // Use this link to get the sql data.
    let countyDataURL = "http://127.0.0.1:5000/api/v1.0/county"
    let stateDataURL = "http://127.0.0.1:5000/api/v1.0/state"

    fetch(countyDataURL)
      .then(response => response.json())
      .then((countyData) => {
        console.log(countyData)
        // console.log("firstlength", countyData[0])
        // Need if statement where if overlay is clicked for state, then maps state
        geoMapIt(countyData)
      })
      .catch(err => console.log(err))


    function fipsMatch(stateFips, countyFips,countyData) {


      console.log("county data length", countyData.length)

      for (let i = 0; i < countyData.length; i++) {
        console.log("county", i, countyData.length)
        if (countyData[i].countyfips === countyFips && countyData[i].statefips === stateFips ) {
          if (countyData[i].percentage >= 50 & countyData[i].party == "republican") {
            console.log("party",countyData[i].party)
            console.log("percentage",countyData[i].percentage)
            return (
              {
                color: "white",
                fillColor: "red",
                fillOpacity: 0.5,
                weight: 1.5
              })}
          if (countyData[i].percentage >= 50 & countyData[i].party == "democrat") {
            // console.log("party",countyData[i].party)
            // console.log("percentage",countyData[i].percentage)
            return ({
              color: "white",
              fillColor: "blue",
              fillOpacity: 0.5,
              weight: 1.5
            })
          }
        }
      }
    }


    function geoMapIt(countyData) {
      // Grabbing our GeoJSON data..
      d3.json(countyLink, function (data) {
        // Creating a geoJSON layer with the retrieved data
        L.geoJson(data, {
          // Style each feature (in this case a neighborhood)
          style: function (feature) {
            // return 
            //  fipsMatch(features.properties.state,features.properties.county)
            //{
            if (feature.properties.STATE === "04" || feature.properties.STATE === "12"  || feature.properties.STATE === "26" || feature.properties.STATE === "42" || feature.properties.STATE === "37") {
            return fipsMatch(feature.properties.STATE, feature.properties.COUNTY,countyData)
            }
            else {
            return {
            color: "white",
            // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
            fillColor: "black",  //chooseColor(feature.properties.county),
            fillOpacity: 0.5,
            weight: 1.5
            }}

          },
          // Called on each feature
          onEachFeature: function (feature, layer) {
            // Set mouse events to change map styling
            layer.on({
              // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
              mouseover: function (event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.9
                });
              },
              // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
              mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
              },
              // When a feature (party) is clicked, it is enlarged to fit the screen
              click: function (event) {
                myMap.fitBounds(event.target.getBounds());
              }
            });
            // Giving each feature a pop-up with information pertinent to it
            // layer.bindPopup("<h1>" + feature.properties.PARTY + "</h1> <hr> <h2>" + feature.properties.PERCENTAGE + "</h2>");
            layer.bindPopup("<h1>" + feature.properties.NAME + "</h1>");
          }
        }).addTo(myMap);
      })
    }
  }

  