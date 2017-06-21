fAr = ["scripts/data/d2.js", "scripts/data/d2s.js","scripts/data/den_prumer_1temp.js","scripts/data/den_cas_1temp.js", "scripts/data/udalosti.js", "scripts/data/d2_cas.js", "scripts/data/d2_ted.js"]
eAr = ["handleJson(d2Data)", "handleJson1(d2sData)","addData(den_prumer_1tempData)", "newTime(den_cas_1tempData)"]


for (var i = 0; i < fAr.length; i++) {
    loading(i)
}

for (var i = 1; i < 8; i++) {
    loading1(i)
    }

for (var i = 1; i < 8; i++) {
    loading2(i)
}

function loading(i) {
    var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= fAr[i];
        head.appendChild(script);
        if (i <= 3) {
            setTimeout(function() {
                
                var er = eAr[i]
                eval(er)
            }, 2000);
        }
}

function loading1(i) {
    var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= "scripts/data/den_cas_" + i + ".js";
        head.appendChild(script);
        setTimeout(function() {
            var er = "getJson2(den_cas_" + i + "Data)"
            eval(er)
        }, 2000);
}

function loading2(i) {
    var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= "scripts/data/den_prumer_" + i + ".js";
        head.appendChild(script);
        setTimeout(function() {
            var er = "getJson1(den_prumer_" + i + "Data)"
            eval(er)
        }, 2000);
}