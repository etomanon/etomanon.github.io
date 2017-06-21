var timelist;

function newTime(data) {
    timelist = data;
    setTimeout(function () {
    updateChart(1)
    }, 750);
}

dayly = []
timely = []

function getJson2(result) {
    timely.push(result)
    var dated = new Date(result.features[0].properties.stav_cas);
    var op = result.features[0].id.slice(result.features[0].id.indexOf('s') + 2, result.features[0].id.indexOf('.'))
    eval("formateti" + op + " = capital(moment(dated).format('dddd'));")
    if (op == 7) {
        setTimeout(function () {
            map.addControl(new filtr());
            $('#choose').change(function () {
                var chose = ($('#choose').val())
                changeDay(chose)
                updateChart(chose)
            })
        }, 1000);
    }

}

function getJson1(data) {
    dayly.push(data)
}


$("#stats").hide()

var yplay = false;

function Play() {
    if (yplay) {
        Stop();
        return
    }
    aktual = false
    $("#txi").html("X");
    $("#pbut").css("background-color", "#2da0e2");
    $("#pbut").css("color", "white");
    var newval = $("#ttime").val()
    newval = parseInt(newval) + 1;
    yplay = true;
    $("#ttime").val(newval);
    $("#ttime").trigger("input");
    var nnw = newval + 1;
    setTimeout(function () {
        Play1(nnw)
    }, 500);
};

function Play1(newval) {
    if (yplay) { } else {
        Stop();
        return
    }
    if ($("#ttime").val() != (newval - 1)) {
        Stop();
        return
    }
    if (aktual) {
        Stop();
        return
    }
    
    $("#ttime").val(newval);
    $("#ttime").trigger("input");
    var nnw = newval + 1;
    if (nnw > 288) {
        Stop();
        return
    }
    if (nnw <= 288 && yplay) {
        setTimeout(function () {
            Play1(nnw)
        }, 500);
    }
};

function Stop() {
    yplay = false;
    $("#txi").html(">");
    $("#pbut").css("background-color", "white");
    $("#pbut").css("color", "black");
};


function sliderChange(newval) {

    aktual = false
    $("#obr1").css("background-color", "#808080");
    $("#stats").css("display", "block");
    $("#stats1").css("display", "none");
    var zpozdeni_sk = 0
    var zpozdeni_brno = 0
    
    gj.eachLayer(function (layer) {
        var us = layer.feature.properties.usek
        var propertyValue = layer.feature.properties['stav_' + newval];
        var zpozdeni_orig = (layer.feature.properties['delka_m'] / (130 * 0.266666666667));
        if (us <= 30) {
            zpozdeni_sk += (layer.feature.properties['delka_m'] / (propertyValue * 0.266666666667)) - zpozdeni_orig;
        }
        if (us > 30) {
            zpozdeni_brno += (layer.feature.properties['delka_m'] / (propertyValue * 0.266666666667)) - zpozdeni_orig;
        }
        $("#zpoz1").html((Math.floor(zpozdeni_sk / 60) + " min " + Math.round((zpozdeni_sk - Math.floor(zpozdeni_sk / 60) * 60))) + " s");
        $("#zpoz2").html((Math.floor(zpozdeni_brno / 60) + " min " + Math.round((zpozdeni_brno - Math.floor(zpozdeni_brno / 60) * 60))) + " s")
        
        d2spoly.eachLayer(function (layer) {
            if (layer.options.usek == us) {
                layer.setStyle({
                    color: getColor(propertyValue)
                })
            }
        })


    })

    gj1.eachLayer(function (layer) {
        var us = layer.feature.properties.usek
        var propertyValue = layer.feature.properties['stav_' + newval];
        
        d2poly.eachLayer(function (layer) {
            if (layer.options.usek == us) {
                layer.setStyle({
                    color: getColor(propertyValue)
                })
            }
        })


    })


    if (timelist == null) {

    }
    else {
        for (var i = 0; i < timelist.features.length; i++) {
            if (timelist.features[i].properties.id == newval) {
                var dated = new Date(timelist.features[i].properties.stav_cas);
                var formate = moment(dated).format('HH:mm');
                $("#sliderStatus").html(formate);
                var formate1 = moment(dated).add(5, 'm').format('HH:mm');
                $("#sliderStatus2").html(formate1);
            }



        };

    }

};


function changeDay(day) {
    aktual = false
    $("#obr1").css("background-color", "#808080");
    $("#stats").css("display", "block");
    $("#stats1").css("display", "none");
    newGJ = gj.toGeoJSON()
    newGJ1 = gj1.toGeoJSON()
    for (var i = 0; i < 60; i++) {
        for (var j = 1; j < 289; j++) {

            stue = "stav_" + j
            newGJ.features[i].properties[stue] = dayly[day - 1].features[i].properties[stue]
            newGJ1.features[i].properties[stue] = dayly[day - 1].features[i].properties[stue]
        }
    }
    gj.clearLayers();
    gj.addData(newGJ);
    gj1.clearLayers();
    gj1.addData(newGJ1);

    timelist = timely[day - 1]
    $("#ttime").trigger("input");

}

function opacit(opacval) {
    osm1.setOpacity(opacval)
    osm2.setOpacity(opacval)
    stamen.setOpacity(opacval)
};

function addData1(data) {
    if (!aktual) {
        return
    }
    newGJ = gj.toGeoJSON()
    newGJ1 = gj1.toGeoJSON()
    for (var i = 0; i < 60; i++) {
            newGJ.features[i].properties["stav_0"] = data.features[i].properties["stav_1"]
            newGJ1.features[i].properties["stav_0"] = data.features[i].properties["stav_1"]
    }
    gj.clearLayers();
    gj.addData(newGJ);
    gj1.clearLayers();
    gj1.addData(newGJ1);

    var dated = new Date(timelist0.features[0].properties.stav_cas);
    var formate = moment(dated).weekday()
    var mmt = moment(dated)
    var mmtMidnight = mmt.clone().startOf('day');
    var diffMinutes = Math.round((mmt.diff(mmtMidnight, 'minutes')) / 5)
    var zpozdeni_sk = 0
    var zpozdeni_brno = 0
    gj.eachLayer(function (layer) {
        var us = layer.feature.properties.usek
        var orig = dayly[formate].features[us - 1].properties['stav_' + diffMinutes]
        var propertyValue = layer.feature.properties['stav_0'];
        var calc = (propertyValue - orig)
        var zpozdeni_orig = (layer.feature.properties['delka_m'] / (130 * 0.266666666667));
        if (us <= 30) {
            zpozdeni_sk += (layer.feature.properties['delka_m'] / (propertyValue * 0.266666666667)) - zpozdeni_orig;
        }
        if (us > 30) {
            zpozdeni_brno += (layer.feature.properties['delka_m'] / (propertyValue * 0.266666666667)) - zpozdeni_orig;
        }
        $("#zpoz1").html((Math.floor(zpozdeni_sk / 60) + " min " + Math.round((zpozdeni_sk - Math.floor(zpozdeni_sk / 60) * 60))) + " s");
        $("#zpoz2").html((Math.floor(zpozdeni_brno / 60) + " min " + Math.round((zpozdeni_brno - Math.floor(zpozdeni_brno / 60) * 60))) + " s")
        d2spoly.eachLayer(function (layer) {
            if (layer.options.usek == us) {
                layer.setStyle({
                    color: getColor1(calc)
                })
            }
        })


    })

    gj1.eachLayer(function (layer) {
        var us = layer.feature.properties.usek
        var orig = dayly[formate].features[us - 1].properties['stav_' + diffMinutes]
        var propertyValue = layer.feature.properties['stav_0'];
        var calc = (propertyValue - orig)
        
        
        d2poly.eachLayer(function (layer) {
            if (layer.options.usek == us) {
                layer.setStyle({
                    color: getColor1(calc)
                })
            }
        })


    })
$("#lege").attr("src","./icons/lege1.png");
}

function addData2(data) {
    if (!aktual) {
        return
    }
    otevrit = ""
    
    nehody.clearLayers();
    nehody.addData(data);
   
    markers.eachLayer(function(feature) {
        if (feature.getPopup().isOpen()) {
            otevrit = feature.feature.properties.udalost
        }
    })
    markers.clearLayers();
    markers.addLayer(nehody);
     markers.eachLayer(function(feature) {
        if (feature.feature.properties.udalost == otevrit) {
            feature.openPopup()
        }
    })
}

function addData3(result){
    if (!aktual) {
                return
            }
            timelist0 = result;
            var dated = new Date(timelist0.features[0].properties.stav_cas);
            if ($(window).width() > 670) {
	            var formate = moment(dated).format('HH:mm') + ' ' + moment(dated).format('(D. M. YYYY)');
            }
                else {
	            var formate = moment(dated).format('HH:mm') + '<br>' + moment(dated).format('(D. M. YYYY)');
            }
            
            $("#sliderStatus3").html(formate);
            $("#stats").css("display", "none");
            $("#stats1").css("display", "block");

}

var aktual = false

function klik() {

    if (aktual) {
        aktual = false
        $("#ttime").trigger("input");
        return
    }
    aktual = true
    $("#obr1").css("background-color", "#2da0e2");
    addData3(d2_casData)

    setTimeout(function () {
    addData1(d2DataS)
}, 100);

setTimeout(function () {
    addData2(udalostiData)
}, 200);

var intmar = setInterval(function () {
    if (!aktual) {
        nehody.clearLayers();
        markers.clearLayers();
        clearInterval(intmar);
        $("#lege").attr("src","./icons/lege.png");
        return
    }
}, 100);
var intaj = setInterval(function () {
    if (!aktual) {
         clearInterval(intaj);
         return
    }


   addData3(d2_casData)
    setTimeout(function () {
    addData1(d2DataS)
}, 100);

setTimeout(function () {
   addData2(udalostiData)
}, 200);

}, 15000);
}

var hid = false

var mapWidth = $('#map').css("width");

var ttimeWidth = $('#ttime').css("width");

var pbutLeft = $("#pbut").css("left");
var titleLeft = $("#stats").css("left");
var titleLeft1 = $("#stats1").css("left");


function hide ()
{

    if (!hid) {
        hid = true
        $('#hidebut').html("<<")
        $("#brno").hide("slide", { direction: "up" }, 200);
        $("#sk").hide("slide", { direction: "up" }, 200);
        $('#hidleg').children('div').each(function () {
        $(this).hide("slide", { direction: "left" }, 200);
    });
    setTimeout(function () {
    $("#map").animate({
        width: "100%"
    }, 200 );
    $("#chartContainer").animate({
        width: "98%"
    }, 200 );
    if ($(window).width() > 1150) {
	    $("#ttime").animate({
        width: "97%"
    }, 200 );
    $("#pbut").animate({
        left: "98%"
    }, 200 );
    }
    else if(($(window).width() <= 1150 && $(window).width() > 700)) {
        $("#ttime").animate({
        width: "94%"
    }, 200 );
    $("#pbut").animate({
        left: "96%"
    }, 200 );
    }
    else if(($(window).width() <= 700)) {
        $("#ttime").animate({
        width: "85%"
    }, 200 );
    $("#pbut").animate({
        left: "90%"
    }, 200 );
    }
    $("#stats").animate({
        left: "35%"
    }, 200 );
    $("#stats1").animate({
        left: "35%"
    }, 200 );
    }, 200);
    }
    else {
        $('#hidebut').html(">>")
        hid = false

         $("#map").animate({
        width: mapWidth
    }, 200 );
    $("#chartContainer").animate({
        width: chartWidth
    }, 200 );
    $("#ttime").animate({
        width: ttimeWidth
    }, 200 );
    $("#pbut").animate({
        left: pbutLeft
    }, 200 );
    $("#stats").animate({
        left: titleLeft
    }, 200 );
    $("#stats1").animate({
        left: titleLeft1
    }, 200 );
        setTimeout(function () {
        $("#brno").show("slide", { direction: "up" }, 200);
        $("#sk").show("slide", { direction: "up" }, 200);
            $('#hidleg').children('div').each(function () {
        $(this).show("slide", { direction: "left" }, 200);
    });
}, 200);

    }

    
}