let opacity = .3;
let timeout;

let year1991 = document.getElementById("year-1991");
let year2001 = document.getElementById("year-2001");
let year2011 = document.getElementById("year-2011");

let map = document.getElementById("svg-kraje");
let SVGDocument
map.onload = function () {
    map.getSVGDocument()

    // let SVGDocument = map.
    let paths = SVGDocument.getElementsByTagName("path");

    window.onload = function () {
        for (i = 0; i < paths.length; i++) {
            paths[i].style.stroke = "#4d88ff";
            paths[i].style.opacity = opacity;
            paths[i].style.fill = "#4d88ff";
        }
    };

    /**
     * Change opacity for specific object
     * @param {event.target} object - object of event
     */
    function changeOpacity(object) {
        if (opacity < 1) {
            opacity += .05;
            timeout = setTimeout(function () {
                changeOpacity(object)
            }, 50);
        }
        object.style.opacity = opacity;
    }

    /**
     * Increase opacity if event was triggered
     * @param event
     */
    function increaseOpacity(event) {
        year1991.innerText = Math.trunc(event.target.getAttribute("POCET_OB_91"));
        year2001.innerText = Math.trunc(event.target.getAttribute("POCET_OB_01"));
        year2011.innerText = Math.trunc(event.target.getAttribute("POCET_OB_11"));
        changeOpacity(event.target);
    }

    /**
     * Decrease opacity if event was triggered
     * @param event
     */
    function decreaseOpacity(event) {
        year1991.innerText = "N/A";
        year2001.innerText = "N/A";
        year2011.innerText = "N/A";
        clearTimeout(timeout);
        event.target.style.opacity = ".3";
        opacity = .3;
    }

    // add listeners to paths
    for (i = 0; i < paths.length; i++) {
        paths[i].addEventListener("mouseover", increaseOpacity);
        paths[i].addEventListener("mouseout", decreaseOpacity);
    }


}

