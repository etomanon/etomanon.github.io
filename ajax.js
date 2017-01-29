$.ajax({
            jsonpCallback: 'getJson',
            dataType: 'jsonp',
            url: 'http://localhost:8080/geoserver/d2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=d2:d2&outputFormat=text/javascript&format_options=callback:getJson',
            success: function(data) {
                var format = new ol.format.GeoJSON();
                var features = format.readFeatures(data, {
                    featureProjection: projection
                });
                vectorSource.addFeatures(features);

            }
        })
		
		
		
$.ajax({
        jsonpCallback: 'getJson',
        url: "http://localhost:8080/geoserver/d2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=d2:d2_sk_time&sortBy=stav_time&outputFormat=text/javascript&format_options=callback:getJson",
        dataType: 'jsonp',
        success: function(result) {
            for (var i = 0; i < result.features.length; i++) {
                if (result.features[i].id == 'd2_sk_time.' + newval) {
                    var dated = new Date(result.features[i].properties.stav_time);
                    var formate = moment(dated).format('HH:mm');
                    $("#sliderStatus").html(formate);
                    var formate1 = moment(dated).add(5, 'm').format('HH:mm (D. M. YYYY)');
                    $("#sliderStatus2").html(formate1);
                }



            };
        }

    });