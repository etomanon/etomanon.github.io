var mymap = L.map('mapid')

var arra = []
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'OpenStreetMap'
}).addTo(mymap);


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#fb1010",
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
		
mymap.fitBounds(gj.getBounds());

function highlightFeature(e) {
    var layer = e.target;
	info.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '',
        fillOpacity: 0
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
	var layer = e.target;
	layer.setStyle({
        radius: 8,
		fillColor: "#fb1010",
		color: "#000",
		weight: 1,
		opacity: 0,
		fillOpacity: 0
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
        mouseout: resetHighlight
        //click: zoomToFeature
    });
	
	var swap = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
	arra.push(swap);
}

var info = L.control();

L.heatLayer(arra, {radius: 30, blur: 20, max: 1, maxZoom: 15, minOpacity: 0.25, gradient: {0: 'yellow', 0.4: 'yellow', 0.6: 'orange', 0.8: 'red'}}).addTo(mymap)

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info');
	this._div.style.backgroundColor = '#fb1010';
	this._div.style.color = 'white';
    this.update();
    return this._div;
};


info.update = function (props) {
	 
    this._div.innerHTML = (props ?
        '<b>' + (props.name) + '</b>' : 'Click on a playground to get info!');
	if (props) {
		if (props.name == null) {
		this._div.innerHTML = '<b>Unknown playground</b>' }
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