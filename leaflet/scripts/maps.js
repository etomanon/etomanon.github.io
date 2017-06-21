setTimeout(function() {
    $("#load").animate({opacity: 0}, 2000)
}, 2000);

moment.locale('cs')
var map = L.map('map',{attributionControl: false}).setView([51, 15], 12);

map.options.minZoom = 7;

customPolyline = L.Polyline.extend({
    options: {
        usek: '-1'
    }
});

L.control.scale({
    imperial: false
}).addTo(map);

var osm1 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'OpenStreetMap'
})

var osm2 = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'OpenStreetMap'
}).addTo(map);

var stamen = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Stamen',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});


function getColor(d) {
    return (d > 0 && d <= 29) ? '#b30000' :
        (d > 29 && d <= 59) ? '#fd6412' :
            (d > 59 && d <= 89) ? '#ffc713' :
                (d > 89 && d <= 119) ? '#00c10e' :
                    d > 119 ? '#006e07' :
                        '#000';
};

function getColor1(d) {
    return (d > 10) ? '#00ff00' :
        (d > -11 && d < 11) ? '#0000ff' :
            (d < -10) ? '#ff0000' :
                        '#000';
};

var d2poly = L.layerGroup();
var d2spoly = L.layerGroup();

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getIcon(latlng, ico) {
return (L.marker(latlng, {icon: L.icon({
    iconUrl: ico,
    iconRetinaUrl: ico,
    iconSize: [30, 30],
    iconAnchor: [+12, +12],
    popupAnchor: [0, 0],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [0, 0],
    shadowAnchor: [22, 94]
})}));
}
var otevrit = ""

setTimeout(function () {
nehody = L.geoJSON(false,{

    onEachFeature: function (feature, layer) {
        layer.bindPopup("<b>Popis:</b><br>" + capital(feature.properties.udalost) + "<br><b>Umístění:</b><br>" + capital(feature.properties.kde) + "<br><b>Čas:</b><br>" + feature.properties.od + " - " + feature.properties.az_do)
        
    },
    pointToLayer: function (feature, latlng) {
                if (feature.properties.typ == 'práce') {
                    return getIcon(latlng, "icons/vlc.png")
                }
                if (feature.properties.typ == 'nehoda') {
                    return getIcon(latlng, "icons/nehoda.png")
                }
                if (feature.properties.typ == 'jiné') {
                    return getIcon(latlng, "icons/jine.png")
                }
            }
})

}, 1000);

var markers = L.markerClusterGroup({showCoverageOnHover: false});
map.addLayer(markers);

function handleJson1(data) {

    gj1 = L.geoJson(data, {
        onEachFeature: function (feature) {
            var us = feature.properties.usek
            var coords = feature.geometry.coordinates[0];
            var lengthOfCoords = feature.geometry.coordinates[0].length;
            for (i = 0; i < lengthOfCoords; i++) {
                holdLon = coords[i][0];
                coords[i][0] = coords[i][1];
                coords[i][1] = holdLon;
            }
            var offset = new customPolyline(coords, {
                weight: 4,
                offset: 5,
                usek: us,
                opacity: 1,
                color: getColor(feature.properties.stav_1)
            }).addTo(d2poly);
        }

    });
}

function handleJson(data) {
    gj = L.geoJson(data, {
        onEachFeature: function (feature) {
            var us = feature.properties.usek
            var coords = feature.geometry.coordinates[0];
            var lengthOfCoords = feature.geometry.coordinates[0].length;
            for (i = 0; i < lengthOfCoords; i++) {
                holdLon = coords[i][0];
                coords[i][0] = coords[i][1];
                coords[i][1] = holdLon;
            }
            var offset = new customPolyline(coords, {
                weight: 4,
                offset: 5,
                usek: us,
                opacity: 1,
                color: getColor(feature.properties.stav_1)
            }).addTo(d2spoly);
        }

    });
    d2spoly.addTo(map)
    map.fitBounds(gj.getBounds());
}


function addData(data) {
    newGJ = gj.toGeoJSON()
    newGJ1 = gj1.toGeoJSON()
    for (var i = 0; i < 60; i++) {
        for (var j = 1; j < 289; j++) {

            stue = "stav_" + j
            newGJ.features[i].properties[stue] = data.features[i].properties[stue]
            newGJ1.features[i].properties[stue] = data.features[i].properties[stue]
        }
    }
    gj.clearLayers();
    gj.addData(newGJ);
    gj1.clearLayers();
    gj1.addData(newGJ1);
    
    setTimeout(function () {
        $("#stats").slideDown();
        sliderChange(1);
    }, 500);
}

map.on('zoomstart', function (e) {
    d2spoly.eachLayer(function (layer) {
        layer.setOffset(0)
    });
    d2poly.eachLayer(function (layer) {
        layer.setOffset(0)
    });

})

map.on('zoomend', function (e) {

    if (e.target._zoom <= 10 && map.hasLayer(d2poly)) {
        map.removeLayer(d2poly)
        map.addLayer(d2spoly)

    }
    if (e.target._zoom >= 11 && map.hasLayer(d2spoly)) {
        map.removeLayer(d2spoly)
        map.addLayer(d2poly)

    }
    d2spoly.eachLayer(function (layer) {
        layer.setOffset(4)
    });
    d2poly.eachLayer(function (layer) {
        layer.setOffset(4)
    });
});

function getJson() { }

var filtr = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        container7 = L.DomUtil.create('div', 'leaflet-control-custom');
        var strang = '<select id="choose">'
        for (var i = 1; i <= 7; i++) {
            var nov = '<option value="' + i + '">' + eval('formateti' + i) + '</option>'
            strang += nov
            if (i == 7) {
                container7.innerHTML = strang + '</select>'
            }
        }

        container7.style.width = '90px';
        container7.style.height = '45px';
        container7.style.marginRight = '5px';
        container7.style.marginTop = '25px';
        return container7;
    }
});


var baseLayers = {
    "OSM": osm1,
    "OSM černobílá": osm2,
    "Stamen Toner": stamen
};

var overlays = {
    "Události": markers
};

L.control.layers(baseLayers, overlays, {
    collapsed: true
}).addTo(map);


var OpacityControl = L.Control.extend({

    options: {
        position: 'topright'
    },

    onAdd: function (map) {
        container = L.DomUtil.create('div', 'leaflet-control-custom');

        container.innerHTML = '<input id="opac" type="range" min="0" max="1" value="1" step="0.1" oninput="opacit(this.value)" />';

        container.style.width = '40px';
        container.style.height = '35px';
        container.style.marginRight = '0px';
        container.style.marginTop = '50px';

        return container;
    }
});

map.addControl(new OpacityControl());


var aktualne =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    container6 = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container6.innerHTML = '<div id="obr1" style="opacity: 1; padding: 5px 5px; background-color: #808080; text-align: center; color: white; width: 100%; height: 100%; cursor: pointer" onclick="klik();" />AKTUÁLNÍ<br>PROVOZ</div>'; 
    
	container6.style.marginRight = '15px';
	container6.style.marginTop = '10px';

    return container6;
  }
});

map.addControl(new aktualne());

container6.addEventListener('mouseover', function () {
    map.doubleClickZoom.disable();
});


container6.addEventListener('mouseout', function () {
    map.doubleClickZoom.enable();
});

container.addEventListener('mouseover', function () {
    map.dragging.disable();
});


container.addEventListener('mouseout', function () {
    map.dragging.enable();
});

var hideControl = L.Control.extend({

    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        container9 = L.DomUtil.create('div', 'leaflet-control-custom');

        container9.innerHTML = '<button id="hidebut" class="button1" onclick="hide()" style="font-weight: bold;"><span id="txis">>></span></button>';

        return container9;
    }
});

map.addControl(new hideControl());