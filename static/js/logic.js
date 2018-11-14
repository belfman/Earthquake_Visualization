// get the API endpoint link, earthquakeDataURL
var earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get the Tectonic plates link, 
var tectonicplateDataURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// define function to scale up magnitude of each earthquake
function getRadius(value) {
  return value*40000
}

// define function to add color for each magnitude scale
function getColor(d) {
  return d > 5 ? '#F30':
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1  ? '#FF0' :
            '#9F3';
}

// set up query to URL
d3.json(earthquakeDataURL, function(data) {
  createFeatures(data.features);
});

// define function to pull earthquake data for feature in the JSON
function createFeatures(earthquakeData) {       

  // set up a GeoJSON layer containing the features array on the earthquakeData object
  // run the onEachFeature function for each piece of data in the array
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .75,
          stroke: true,
          color: "black",
          weight: .9
      })
    }
  });

  // send the earthquakes layer to the createMap function
  createMap(earthquakes)
}

function createMap(earthquakes) {

  // define streetmap and darkmap layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var pirateMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.pirates",
    accessToken: API_KEY
  });

  // define a baseMaps object to hold the base layers
  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Street Map": streetmap,
    "Pirate Map": pirateMap
  };

  // add a tectonic plate layer
  var tectonicPlates = new L.LayerGroup();

  // create an overlay object to hold the overlay layer
  var overlayMaps = {
    "7 Day Earthquake Report": earthquakes,
    "Global Tectonic Plates": tectonicPlates
  };

  // create the map, with satellite, earthquakes and fault lines as default views, center on United States
  var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 3,
    layers: [satelliteMap, earthquakes, tectonicPlates]
  });

    // add Fault lines data
    d3.json(tectonicplateDataURL, function(plateData) {
    // adding our geoJSON data, along with style information, to the tectonicplates layer.
    L.geoJson(plateData, {
      color: "green",
      weight: 3
    })
    .addTo(tectonicPlates);
  });

  // create a layer control, pass in the baseMaps and overlayMaps
  // add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
      //set intervals for magnitudes to display in legend
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  // add legend to myMap
  legend.addTo(myMap);

}

// set up text animation
$(function () {
  $('.tlt').textillate({
      loop: true,
      initialDelay: 20,
      outEffects: [ 'hinge' ],
      in: {
          effect: 'bounce',
          delay: 50,
          shuffle: true,
          
      },
      out: {
          effect: 'fadeOutDownBig',
          delay: 100,
          shuffle: true
      }
  });
});





asdfasdfasd