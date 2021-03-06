
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
    $("#wel .words div").each(function (i, obj) {
        var rotate = Math.random() * 360;
        var top = getPosition()
        var left = getPosition()
        $(obj).css({
            transform: "rotate(" + rotate + "deg) translate(" + left + "px," + top + "px)",
            opacity: "0"
        });
    })
    setTimeout(function () {
        $("#wel .words div").each(function (i, obj) {
            $(obj).css({
                transform: "rotate(0deg) translate(0, 0)",
                transition: "3s ease-out all",
                opacity: "1"
            })
            setTimeout(function () {
                    $(obj).css({
                        transform: "scale(1.3)",
                        textShadow: "0 8px 5px rgba(0, 0, 0, 0.2)",
                        transition: "0.4s ease-out all",
                    })
            }, 3100 + i * 110)

        })
    }, 50);
}, 500);

function getPosition() {
    var positive = Math.random() > 0.5 ? true : false;
    var position = positive ? Math.random() * 150 : Math.random() * 150 * -1;
    return position;
}


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

    $("#maps").click(function () {
        $('#maps-items').addClass('item-wrapper--active');
        $('#websites-items').removeClass('item-wrapper--active');
        $('#maps').addClass('tags-item--active');
        $('#websites').removeClass('tags-item--active');
    });

    $("#websites").click(function () {
        $('#websites-items').addClass('item-wrapper--active');
        $('#maps-items').removeClass('item-wrapper--active');
        $('#websites').addClass('tags-item--active');
        $('#maps').removeClass('tags-item--active');
    });

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
        autoplay: false,
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

    document.getElementsByClassName("divider")[0].addEventListener("click", function() {
        open("https://github.com/etomanon","_blank");
    });

});




