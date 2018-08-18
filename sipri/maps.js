var mymap = L.map('mapid')


var stamen = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Stamen, SIPRI',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(mymap);


function getColor(d) {
    return (d > 3.5 && d < 101) ? '#034e7b' :
           d > 3  ? '#0570b0' :
           d > 2.5  ? '#3690c0' :
           d > 2  ? '#74a9cf' :
           d > 1.5   ? '#a6bddb' :
           d > 0.75   ? '#d0d1e6' :
           d > 0   ? '#f1eef6' :
					'#000';
};

function style(feature) {
    return {
        fillColor: getColor(feature.properties.F2),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 1
    };
}

var gj = L.geoJson(euc, {
    style: style,
	onEachFeature: onEachFeature
        
		}).addTo(mymap);
		
mymap.fitBounds(gj.getBounds());

function highlightFeature(e) {
    var layer = e.target;
	info.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: '#cb181d',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    times($("#ttime").val());
	info.update();
}

function zoomToFeature(e) {
	var layer = e.target;
    mymap.fitBounds(e.target.getBounds());
	myLineChart.destroy();
	chartUpdate(layer.feature.properties);
	
	
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


function chartUpdate (props) {
	lab = [];
	pubs = [];
	for (var i = 2; i < 30; i++) {
		if (eval("props.F" + i) == 0) {
			continue;
		}
		
		var fet = data.value[i - 2]
		lab.push(fet)
        var fets = eval("props.F" + i)
        pubs.push(fets)
		
	}	
	createChart(eval("props.NAME"))
}

var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
};


info.update = function (props) {
	var chan = $("#ttime").val();
	var tema = $("#sliderStatus").html();
	if ((props)) {
		if ((eval("props.F" + chan) == 0)) {
			uva = 'Unknown'
		} else {
			uva = eval("props.F" + chan)
		}
	} else {
		
	}
    this._div.innerHTML = (props ?
        '<b>' + props.NAME + ' - ' + tema + '</b><br />' + uva + ' % of GDP'
        : 'Click on a state<br>to create its chart!');
};

info.addTo(mymap);


function opacit(opacval) {
    gj.eachLayer(function(layer) {
		layer.setStyle(newStyle1(layer, opacval));
	})
};

var arr = [1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]

function times(val) {
	var formate = arr[val - 2];
	$("#sliderStatus").html(formate);
	gj.eachLayer(function(layer) {
        propertyValue = layer.feature.properties['F' + val];
		layer.setStyle(newStyle(layer, propertyValue));
	})
		
}

function newStyle(layer, val) {
	var opa = $("#opac").val();
    return {
        fillColor: getColor(val),
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
        fillOpacity: val
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
		//div.innerHTML = 'id="legendary"'
    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div><i style="background:' + getColor(grades[i] + 1) + '";color="black"></i> ' +
            grades[i] + (grades[i + 1] ? ' - ' + grades[i + 1] + ' %</div>' : '+ %</div>');
			
    }

    return div;
};

legend.addTo(mymap);


var yplay = false;

function Play() {
    if (yplay) {
        Stop();
        return
    }
    $("#pbut").html("X");
    $("#pbut").css("background-color", "#2da0e2");
    $("#pbut").css("color", "white");
    var newval = $("#ttime").val()
    newval = parseInt(newval) + 1;
    yplay = true;
    $("#ttime").val(newval);
    $("#ttime").trigger("input");
    var nnw = newval + 1;
    setTimeout(function() {
        Play1(nnw)
    }, 1000);
};

function Play1(newval) {
    if (yplay) {} else {
        return
    }
    if ($("#ttime").val() != (newval - 1)) {		
        return
    }
    $("#ttime").val(newval);
    $("#ttime").trigger("input");
    var nnw = newval + 1;
    if (nnw <= 29 && yplay) {
        setTimeout(function() {
            Play1(nnw)
        }, 1000);
    } else {Stop()}
};

function Stop() {
    yplay = false;
    $("#pbut").html(">");
    $("#pbut").css("background-color", "white");
    $("#pbut").css("color", "black");
};


var OpacityControl =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    container = L.DomUtil.create('div', 'leaflet-control-custom');
	
	container.innerHTML = '<input id="opac" type="range" min="0" max="1" value="1" step="0.1" oninput="opacit(this.value)" />'; 
    
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

    // Re-enable dragging when user's cursor leaves the element
    container.addEventListener('mouseout', function () {
        mymap.dragging.enable();
    });
	
	
var hideLegends =  L.Control.extend({

  options: {
    position: 'bottomright'
  },

  onAdd: function (map) {
    container1 = L.DomUtil.create('div', 'leaflet-control-custom');
	container1.innerHTML = '<button onclick="$(&quot;.info.legend&quot;).slideToggle(&quot;slow&quot;)" style="font-weight: bold; cursor: pointer;">X</button>'; 
    
    container1.style.width = '10px';
    container1.style.height = '10px';

    return container1;
  }
});

mymap.addControl(new hideLegends());