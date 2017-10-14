
// hide .navbar first
$("#navd").hide();
$("#bg").css("opacity", "0");
$("#wel").hide();

setTimeout(function () {
    $('#wel').fadeIn(4000);
    $("#bg").animate({
        opacity: 1
    }, 2000)
    $("#wel").css("display", "block");
    $("#hi").css("display", "none");

}, 500);


$(".toggle").on("click", function () {
    $(".toggle").parent().parent().toggleClass('active');
    $('#nav-icon3').toggleClass('open');
});


$(document).ready(function () {
    // fade in .navbar
    $(window).scroll(function () {
        // set distance user needs to scroll before we fadeIn navbar
        if ($(this).scrollTop() > $(window).height() / 2) {
            $('#navd').fadeIn();
        } else {
            $('#navd').fadeOut();
        }
    })



    $("h2, #compass").click(function () {
        $('html, body').animate({
            scrollTop: $(".glob-wrap").offset().top - 60
        }, 1000);
    });

    $("#port").click(function () {
        $('#nav-icon3').toggleClass('open');
        $(".toggle").parent().parent().toggleClass('active');
        $('html, body').animate({
            scrollTop: $(".glob-wrap").offset().top - 60
        }, 1000);
    });

    $("#ba").click(function () {
        $('#nav-icon3').toggleClass('open');
        $(".toggle").parent().parent().toggleClass('active');
        $('html, body').animate({
            scrollTop: $("#bach").offset().top - 48
        }, 1000);
    })
    $("#car").click(function () {
        $('#nav-icon3').toggleClass('open');
        $(".toggle").parent().parent().toggleClass('active');
        $('html, body').animate({
            scrollTop: $("#carousel").offset().top - 48
        }, 1000);
    });

    $(".owl-carousel").owlCarousel({
        center: false,
        items: 1,
        nav: true,
        loop: true,
        autoplay: true,
        margin: 0,
        navText: ['', ''],
        responsive: {
            550: {
                items: 2
            },
            850: {
                items: 3
            }
        }
    });

    objectFitImages('.owl-carousel .owl-item img');
});




