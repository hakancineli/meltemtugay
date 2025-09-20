function sil() { return confirm('Bu işlemi yapmak istediğinize emin misiniz?') }

$(document).ready(function () {
    $(".menuac").click(function () {


        $(".mobil-menu").slideToggle();

        $(".menuac").css("display", "none");
        $(".menukapat").css("display", "block");


    });
    $(".menukapat").click(function () {

        $(".mobil-menu").slideToggle();

        $(".menuac").css("display", "block");
        $(".menukapat").css("display", "none");

    });
    $(".mobmenu>li").click(function () {
        var menu2 = $(this).find("ul");
        var sayi2 = $(menu2).find("li").size();



        if (menu2.css("height") == "0px") {
            $(".mobmenu>li>ul").animate({
                height: 0
            }, 300);
            $(this).find("ul").animate({
                height: 29 * sayi2
            }, 300);
        }
        else {
            $(this).find("ul").animate({
                height: 0

            }, 300);
        }
    });
});