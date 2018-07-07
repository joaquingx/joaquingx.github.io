var colorValue = Math.random() * 360;

var options = {
    color: '#000',
    weight: 1,
    fillColor: 'hsl(' + colorValue + ',100%,50%)',
    radius: 50,
    fillOpacity: 0.7,
    rotation: 0.0,
    position: {
        x: 0,
        y: 0
    },
    offset: 0,
    numberOfSides: 50,
    width: 500,
    height:500
};


var markers = {};
var cities = L.layerGroup();
var queries = lc.q;

function searchMarker(actMarkers, lat, lon){
    jQuery.each(actMarkers, function (i, element) {
        if( element._latlng.lat == lat  && element._latlng.lng == lon){
            return true;
        }
    });
    return false;
}

function groupAllMarkers(map,layerController){
    layerController.removeLayer(cities);
    cities.clearLayers();
    for(var i in markers){
        for(var j in markers[i]){
            cities.addLayer(markers[i][j]);
        }
    }
    layerController.addOverlay(cities,"Markers");
    cities.addTo(map);
}

function deleteAllMarkers(map){
    for(var i in markers){
        for(var j in markers[i]){
            map.removeLayer(markers[i][j]);
        }
    }
    markers = {};
}

function deleteMarkers(map,country) {
    if(markers[country] !== undefined) {
        jQuery.each(markers[country], function (i, element) {
            map.removeLayer(element);
        });
    }
    markers[country] = undefined;
}


function drawMarkersInMapChart(rawJson,data,cOptions,map,e,country){
    options.data = data;
    options.chartOptions = cOptions;
    console.log(options);
    var barChartMarker = new L.CoxcombChartMarker(new L.LatLng(e.latlng.lat, e.latlng.lng), options);
    if(markers[country] === undefined)
        markers[country] = [];
    markers[country].push(barChartMarker);
    barChartMarker.addTo(map);
}

function dameHTML(specimen){
    var author,specie,when,habitat,microhabitat,image;
    author = specimen.collectedBy;
    specie = specimen.scientificName;
    when = specimen.dateCollectedStart;
    habitat = specimen.habitat;
    microhabitat = specimen.microhabitat;
    image = lc.q.photosCollector[specimen.antwebTaxonName];
    if(image === undefined){
        image = "gAntz/assets/loading.gif";
    }
    return "<h3>" + specie + "</h3>" +
           "<img class='sidebar-image' src='" + image +  "'/>" +
           "<p>Habitat: " + habitat + "</p>"+
           "<p>Microhabitat: " + microhabitat + "</p>"+
           "<p>Collected by: " + author + "</p>" +
           "<p>Founded on: " + when + "</p>"

}
function drawMarkersInMapDetail(rawJson, map,country) {
    var rawSize = rawJson["metaData"].count;
    var dame = {};
    for(var i = 0; i < rawSize ; ++i){
        var actLat = parseFloat(rawJson["specimens"][i].geo.coordinates.lat);
        var actLon = parseFloat(rawJson["specimens"][i].geo.coordinates.lon);
        if(!isNaN(actLat) && !isNaN(actLon)) {
            console.log(actLat);
            console.log(actLon);
            var mal = Math.floor((Math.random() * 100) + 1)/1000;
            var mal2 = Math.floor((Math.random() * 100) + 1)/1000;
            console.log(mal + "   " + mal2);
            var marker = L.marker([actLat+mal, actLon+mal2]).addTo(map);
            // var popupMessage = rawJson["specimens"][i].scientificName;
            var key = rawJson["specimens"][i]["antwebTaxonName"];
            dame[marker] = dameHTML(rawJson["specimens"][i]);
            console.log(rawJson["specimens"][i]);
            var queries = lc.q;
            queries.getImage(key);
            marker.bindPopup(dameHTML(rawJson["specimens"][i])).openPopup();
            // console.log(popupMessage);
            if(markers[country] === undefined)
                markers[country] = [];
            markers[country].push(marker);
        }
    }
    // marker.on('click', function(){
    //     // console.log(dame[key]);
    //     document.getElementById("sidebar").innerHTML = dame[marker];
    //     sidebar.toggle();
    // });

    // var pepe=L.marker([45,-10]).addTo(map);
    // pepe.bindPopup("xdddd").openPopup();
}

