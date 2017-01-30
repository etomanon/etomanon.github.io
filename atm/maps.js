var mymap = L.map('mapid')


var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OpenStreetMap'
}).addTo(mymap);


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 0,
    fillOpacity: 0
};

var geojsonMarkerOptions1 = {
    radius: 0,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 0,
    fillOpacity: 0
};


var gj = L.geoJson(euc, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
	onEachFeature: onEachFeature
        
		}).addTo(mymap);
		
var gj1 = L.geoJson(euc, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions1);
    }  
		}).addTo(mymap);
		
		
mymap.fitBounds(gj.getBounds());

function highlightFeature(e) {
    var layer = e.target;
	var opa = $("#opac").val();
	info.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '',
        fillOpacity: opa,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
	var opa = $("#opac").val();
	var layer = e.target;
	layer.setStyle({
        radius: 8,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: opa,
		fillOpacity: opa
    });
	info.update();
}

function zoomToFeature(e) {
	var feat = e.target;
    mymap.setView(feat.getLatLng(), 18, {animate: true});
	
	
}

function zoomToMarker(e) {
	var feat = e.target;
    mymap.setView(feat.getLatLng(), 18, {animate: true});
	
	
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info');
	this._div.style.backgroundColor = '#ff7800';
	this._div.style.color = 'white';
    this.update();
    return this._div;
};


info.update = function (props) {
	 
    this._div.innerHTML = (props ?
        '<b>' + (props.name) + '</b>' : 'Click on an ATM to get info!');
	if (props) {
		if (props.name == ' ') {
		this._div.innerHTML = '<b>Unknown bank</b>' }
	}
};

info.addTo(mymap);


function opacit(opacval) {
    gj.eachLayer(function(layer) {
		layer.setStyle(newStyle1(layer, opacval));
	})
	if (atm_position) {atm_position.setOpacity(opacval)}
	if (current_position) {current_position.setOpacity(opacval)}
};

function newStyle(layer, val) {
	var opa = $("#opac").val();
    return {
        fillColor: "red",
        weight: 2,
        opacity: opa,
        color: 'white',
        fillOpacity: opa
    };
}

function newStyle1(layer, val) {
	var opa = $("#opac").val();
    return {
		opacity: opa,
        fillOpacity: opa
    };
}

L.control.scale({
    imperial: false
}).addTo(mymap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.75, 1.5, 2, 2.5, 3, 3.5],
        labels = [];
		
    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '";color="black"></i> ' +
            grades[i] + (grades[i + 1] ? ' - ' + grades[i + 1] + ' % <br>' : '+ %');
			
    }

    return div;
};



var OpacityControl =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    container = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container.innerHTML = '<input id="opac" type="range" min="0" max="1" value="0" step="0.1" oninput="opacit(this.value)" />'; 
    
    container.style.width = '40px';
    container.style.height = '35px';
	container.style.marginLeft = '0px';
	container.style.marginTop = '50px';

    return container;
  }
});

mymap.addControl(new OpacityControl());

container.addEventListener('mouseover', function () {
        mymap.dragging.disable();
    });

    
    container.addEventListener('mouseout', function () {
        mymap.dragging.enable();
    });
	
var current_position, atm_position

    function onLocationFound(e) {
		mymap._handlers.forEach(function(handler) {
    handler.disable();

});
      if (current_position) {
          mymap.removeLayer(current_position);
		  mymap.removeLayer(atm_position);
      }
		
      current_position = L.marker(e.latlng, {icon: myIcon1}).addTo(mymap).bindPopup("Your position!").openPopup();
	  lgeo= current_position.toGeoJSON()
	  //mymap.setView(current_position.getLatLng(), 16);
	  var filtered = gj1.toGeoJSON()
	  var nearest1 = turf.nearest(lgeo, filtered);
	 current_position.on("click", zoomToMarker)
	  var features = turf.featureCollection([lgeo, nearest1])

	  var bbox = turf.bbox(features);
		var bounds1 = [bbox[1], bbox[0]]
		var bounds2 = [bbox[3], bbox[2]]
		
	  var swap = [nearest1.geometry.coordinates[1], nearest1.geometry.coordinates[0]]
	  var distance = Math.round(turf.distance(lgeo, nearest1) * 1000);
	  atm_position = L.marker(swap, {icon: myIcon}).addTo(mymap).bindPopup("The nearest ATM!<br>Distance: " + distance + " meters<br>" + nearest1.properties.name);
      atm_position.on("click", zoomToMarker)
	setTimeout(function() {
        mymap.fitBounds([bounds1, bounds2]);
		setTimeout(function() {
		mymap.setZoom(mymap.getZoom() - 2)
		}, 100);
    }, 500);
	setTimeout(function() {
        atm_position.openPopup()
		mymap._handlers.forEach(function(handler) {
    handler.enable();

});
    }, 500);
    }

    function onLocationError(e) {
      alert('Please enable geolocation on your device and reload the page.\n' + e.message);
    }

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

const provider = new window.GeoSearch.OpenStreetMapProvider();

const searchControl = new window.GeoSearch.GeoSearchControl({
  provider: provider,
  showMarker: false
});

mymap.addControl(searchControl);
mymap.locate({setView: false});


var myIcon = L.icon({
    iconUrl: 'atm.png',
    iconRetinaUrl: 'atm.png',
    iconSize: [30, 30],
    iconAnchor: [+12, +12],
    popupAnchor: [0, 0],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [0, 0],
    shadowAnchor: [22, 94]
});


var myIcon1 = L.icon({
    iconUrl: 'marker.png',
    iconRetinaUrl: 'marker.png',
    iconSize: [30, 30],
    iconAnchor: [+12, +12],
    popupAnchor: [0, 0],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [0, 0],
    shadowAnchor: [22, 94]
});

var pointi = L.icon({
    iconUrl: 'point.png',
    iconRetinaUrl: 'point.png',
    iconSize: [30, 35],
    iconAnchor: [+12, +12],
    popupAnchor: [0, 0],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [0, 0],
    shadowAnchor: [22, 94]
});


var locateMe =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    container4 = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container4.innerHTML = '<img src="marker.png" style="width: auto; height: 100%; cursor: pointer" onclick="mymap.locate({setView: false});" />'; 
    
    container4.style.width = '40px';
    container4.style.height = '35px';
	container4.style.marginLeft = '0px';
	container4.style.marginTop = '5px';

    return container4;
  }
});

mymap.addControl(new locateMe());


var pointer =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    container5 = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container5.innerHTML = '<img id="obr" src="point.png" style="width: auto; height: 100%; cursor: pointer" onclick="klik();" />'; 
    
    container5.style.width = '40px';
    container5.style.height = '35px';
	container5.style.marginLeft = '0px';
	container5.style.marginTop = '5px';

    return container5;
  }
});

mymap.addControl(new pointer());
$("#tooltip").fadeOut(0);
function klik () {
	$("#tooltip").css("visibility", "visible");

	$("#tooltip").fadeIn(1000);

	setTimeout(function() {
        mymap.on('click', onMapClick);
    }, 500);
	setTimeout(function() {
		$("#tooltip").fadeOut(2000);
		setTimeout(function() {
			$("#tooltip").css("visibility", "hidden");
			}, 2000);
        
    }, 4000);
	
	
}
var pointer_position

function onMapClick(e) {
	mymap.off('click', onMapClick);
	mymap._handlers.forEach(function(handler) {
    handler.disable();

});
	if (pointer_position) {
          mymap.removeLayer(pointer_position);
		  mymap.removeLayer(atm_position);
      }
    pointer_position = L.marker(e.latlng, {icon: pointi}).addTo(mymap).bindPopup("You clicked here!").openPopup();
	pointer_position.on("click", zoomToMarker)
	pgeo= pointer_position.toGeoJSON()
	  //mymap.setView(pointer_position.getLatLng(), 16);
	var filtered = gj1.toGeoJSON()
	  var nearest2 = turf.nearest(pgeo, filtered);
	  	  var features = turf.featureCollection([pgeo, nearest2])

	  var bbox = turf.bbox(features);
		var bounds1 = [bbox[1], bbox[0]]
		var bounds2 = [bbox[3], bbox[2]]
	  var swap = [nearest2.geometry.coordinates[1], nearest2.geometry.coordinates[0]]
	  var distance = Math.round(turf.distance(pgeo, nearest2) * 1000);
	  atm_position = L.marker(swap, {icon: myIcon}).addTo(mymap).bindPopup("The nearest ATM!<br>Distance: " + distance + " meters<br>" + nearest2.properties.name);
		atm_position.on("click", zoomToMarker)
	setTimeout(function() {
        mymap.fitBounds([bounds1, bounds2]);
		setTimeout(function() {
		mymap.setZoom(mymap.getZoom() - 2)
		}, 100);
    }, 500);
	setTimeout(function() {
        atm_position.openPopup()
		mymap._handlers.forEach(function(handler) {
    handler.enable();

});
    }, 500);
	
}

function klik1() {
	if (mymap.hasLayer(markers)) {
		mymap.removeLayer(markers)
		
	}
	else {
		mymap.addLayer(markers)
		
	}
	
}


var cluster =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    container6 = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container6.innerHTML = '<div id="obr1" style="opacity: 1; padding: 5px 5px; background-color: #ff7800; text-align: center; color: white; width: 100%; height: 100%; cursor: pointer" onclick="klik1();" />CLUSTERS<br>ON / OFF</div>'; 
    
    container6.style.width = '70px';
    container6.style.height = '35px';
	container6.style.marginRight = '15px';
	container6.style.marginTop = '10px';

    return container6;
  }
});

mymap.addControl(new cluster());


var markers = L.markerClusterGroup({showCoverageOnHover: false});
markers.addLayer(gj1);

mymap.addLayer(markers);




var filtr =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    container7 = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container7.innerHTML = '<select id="choose">     <option value="all">All banks</option>     <option value="ČSOB">ČSOB</option>     <option value="KB">Komerční banka</option> 	<option value="Fio banka">Fio banka</option>  <option value="MONETA Money Bank">MONETA Money Bank</option></select>'
	

    

    
    container7.style.width = '100px';
    container7.style.height = '45px';
	container7.style.marginRight = '5px';
	container7.style.marginTop = '25px';

    return container7;
  }
});

mymap.addControl(new filtr());
$('#choose').change(function() {
		var chose = ($('#choose').val())
		mymap.removeLayer(gj)
		mymap.removeLayer(gj1)
		gj = L.geoJson(euc, {
		pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
	onEachFeature: onEachFeature,
	filter: function(feature, layer) {
        if (chose == 'all') {return true}
		else if (feature.properties.name == chose) { return true}
		else {return false}
    }
        
		}).addTo(mymap);
		
	gj1 = L.geoJson(euc, {
		pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions1);
    },
	filter: function(feature, layer) {
        if (chose == 'all') {return true}
		else if (feature.properties.name == chose) { return true}
		else {return false}
    }
        
		}).addTo(mymap);
	$("#opac").trigger("input");
	markers.clearLayers()
	if(mymap.hasLayer(markers)) {		
		markers.addLayer(gj1);
	}
	else{
		markers.addLayer(gj1);
	}
    }); 