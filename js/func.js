// hide .navbar first
$("#navd").hide();
$("#bg").css("opacity", "0");
$("#wel").hide();
$('#wel').fadeIn(4000);
setTimeout(function () {
    $("#wel").css("display", "block");
}, 500);
$("#bg").animate({
    opacity: 1
}, 2000)

// fade in .navbar
$(function () {
    $(window).scroll(function () {
        // set distance user needs to scroll before we fadeIn navbar
        if ($(this).scrollTop() > $(window).height() / 2) {
            $('#navd').fadeIn();
        } else {
            $('#navd').fadeOut();
        }
    })
});



$("h2").click(function () {
    $('html, body').animate({
        scrollTop: $(".item:first").offset().top - 60
    }, 1000);
});

$("#port").click(function () {
    $('html, body').animate({
        scrollTop: $(".item:first").offset().top - 60
    }, 1000);
});

$("#ba").click(function () {
    $('html, body').animate({
        scrollTop: $("#bach").offset().top - 48
    }, 1000);
});

function hambh() {
    $("li").unbind("click");
    $("#ba").focus();
    $("li:not(:first-child)").animate({ opacity: '0' }, '500');
    $("#hamb").html("&#9776;")
    setTimeout(function () {
        $("li:not(:first-child)").css("display", "none");

        hambu()
    }, 500);
}

var har = false
var hamr = $("#hamb")
setInterval(function () {
    if ("none" == hamr.css("display")) {
        $("li:not(:first-child)").css("display", "inline-block");
        $("li:not(:first-child)").css("opacity", "1");
        har = false
    }

}, 100);

setInterval(function () {
    if ("inline-block" == hamr.css("display") && !har) {
        $("li:not(:first-child)").css("display", "block");
        $("li:not(:first-child)").css("opacity", "0");
        har = true
    }

}, 100);

hambu()

function hambu() {
    $("#hamb").click(function () {
        $("#hamb").unbind("click");
        $("li:not(:first-child)").css("opacity", "0");
        $("li:not(:first-child)").css("display", "block");
        $("li:not(:first-child)").animate({ opacity: '1' }, '500');
        $("#hamb").html("X")
        $("li").click(function () {
            hambh()
        });
    });
}




