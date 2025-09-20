

$(".nav_button").click(function () {
    //$(".mobile-menu").css("opacity", "1");
    //$(".mobile-menu").css("display", "block");
    $(".mobile-menu").css("right", "0");
    var ekranwidth = $(document).width();
    if (ekranwidth<1280) {
        $(".mobile-menu").css("width", "100%");
    }
    else {
        $(".mobile-menu").css("width", "40%");
    }
    
    $(".mobile-menu-kapat").css("display", "block");
});

$(".menu_item").click(function () {
    var id = $(this).attr("id");
    var baslik = $(this).html().replace("<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>", "");;

    $("." + id).css("display", "block");
    if ($("." + id).css("display") == "block") {
        $(".mobile-menu-icerik>ul").css("display", "none");
        $(".mobile-menu-icerik>ul").css("width", "0px");
        //$(".mobile-menu-icerik>ul").css("opacity", "0");
        $("." + id).css("display", "block");
        $("." + id).css("width", "calc(100% - 50px)");
        $("." + id).css("opacity", "1");
        $("#sec-mobile-home").css("cursor", "pointer");

        $(".mobile-menu-secimler>ul").append("<li id=\"sec-" + id + "\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i> " + baslik + "</li>");
    }
});
$(".mobile-menu-secimler>ul>li").click(function () {
    var id = $(this).attr("id");
    if (id == "sec-mobile-home") {
        if ($(".mobile-home").css("display") == "none") {
            $("#sec-mobile-home").css("cursor", "unset");
            $(".mobile-menu-icerik>ul").css("width", "0px");
            //$(".mobile-menu-icerik>ul").css("opacity", "0");
            $(".mobile-home").css("display", "block");
            $(".mobile-home").css("width", "calc(100% - 50px)");
            $(".mobile-home").css("opacity", "1");
            $(".mobile-menu-secimler>ul>li:last-child").remove();

        }
    }
});
$(".mobile-menu-kapat").click(function () {
    //$(".mobile-menu").css("opacity", "0");
    $(".mobile-menu").css("right", "-100%");
    $(".nav_button").css("display", "block");
    $(".mobile-menu-kapat").css("display", "none");
});