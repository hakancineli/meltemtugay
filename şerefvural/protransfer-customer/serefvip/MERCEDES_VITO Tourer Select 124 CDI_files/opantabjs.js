$(document).ready(function () {
    var sayac = 0;
    

    if (sessionStorage.getItem("acilirtab") == "kapali")
    {
        var acilirwidthal = $(".form-div").width();
        var aclirwidthhesap = (-acilirwidthal) + 20
        $(".form-div").stop().animate({ right: aclirwidthhesap }, "medium");
        $(".ac").css("display", "block");
    }
    else
    {
        $(".form-div").stop().animate({ right: "0" }, "medium");
        $(".ac").css("display", "none");
    }

  
    function kontrol() {
        sayac = 0;
        
        if (document.getElementById('adsoyad').value == "") {
            document.getElementById('adsoyad').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('adsoyad').style.borderColor = "green";
        }

        if (document.getElementById('telno').value == "") {
            document.getElementById('telno').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('telno').style.borderColor = "green";
        }

        if (document.getElementById('markaidsi').value == "0") {
            document.getElementById('markaidsi').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('markaidsi').style.borderColor = "green";
        }


        if (document.getElementById('modelidsi').value == "0") {
            document.getElementById('modelidsi').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('modelidsi').style.borderColor = "green";
        }
        if (document.getElementById('fiyatendusuk').value == "") {
            document.getElementById('fiyatendusuk').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('fiyatendusuk').style.borderColor = "green";
        }
        if (document.getElementById('fiyatenyuksek').value == "") {
            document.getElementById('fiyatenyuksek').style.borderColor = "red";
            sayac++;
        }
        else {
            document.getElementById('fiyatenyuksek').style.borderColor = "green";
        }
        if (sayac > 0) {
            return false;
        }
        
    }

    $("#gonder-talep").click(function () {
       
        kontrol();
        if (sayac > 0) {
            return false;
        }
        else {
           
            $(".loaderdv").css("display", "block");
            var adsoyad = document.getElementById('adsoyad').value;
            var telno = document.getElementById('telno').value;
            var fiyatendusuk = document.getElementById('fiyatendusuk').value;
            var fiyatenyuksek = document.getElementById('fiyatenyuksek').value;
            var markaid = document.getElementById('markaidsi').value;
            var modelid = document.getElementById('modelidsi').value;
           
            $.ajax({
                type: "POST",
                url: "/AdminArac/TalepEkle",
                data: { Adsoyad: adsoyad, Telno: telno, Fiyatendusuk: fiyatendusuk, Fiyatenyuksek: fiyatenyuksek, Markaid: markaid, Modelid: modelid },
                success: function (result) {
                    if (result == "1") {
                        document.getElementById('adsoyad').value = "";
                        document.getElementById('fiyatendusuk').value = "";
                        document.getElementById('fiyatenyuksek').value = "";
                        $(".tesekkurler2").css("display", "block");
                        $(".loaderdv").css("display", "none");
                    }
                }
            });
            
            return false;
        }
        
       
    });

    function LoadCust(result) {

        $("#ajax-main").html(result);
    }
    $(".sil").click(function () {

        var ConfirmDelete = confirm("Silme işlemini onaylıyormusunuz?");
        if (ConfirmDelete) {
            var secilennot = $(this).attr('id')
            var notid = secilennot;
            $.ajax({
                type: "POST",
                url: "/AdminArac/NotSil",
                data: { notid: notid },
                success: function (result) {
                    if (result == "1") {
                        $("." + secilennot).remove();
                    }
                }
            });
        }
        return false;

        });
    $(".kapat").click(function () {
        var acilirwidthal = $(".form-div").width();
        var aclirwidthhesap = (-acilirwidthal) + 20
        $(".form-div").stop().animate({ right: aclirwidthhesap }, "medium");
        $(".ac").css("display", "block");
       
        sessionStorage.setItem("acilirtab", "kapali");

    });

    $(".ac").click(function () {
        $(".form-div").stop().animate({ right: "0" }, "medium");
        $(".ac").css("display", "none");
        
        sessionStorage.setItem("acilirtab", "acik");

    });
    $(".opentab>h2").click(function () {
        var secilenid = $(this).attr('class')
        if (secilenid.indexOf("active") > -1) {
            $(this).removeClass("active")
        }
        else {
            $(".opentab>div").slideUp();
            $(".opentab>h2").removeClass("active");
            $(this).addClass("active");
        }
        secilenid = secilenid.replace(" active", "");
        $("#" + secilenid).slideToggle();
       
    });
    $(".opentab2>h2").click(function () {
        var secilenid = $(this).attr('class')
        if (secilenid.indexOf("active") > -1) {
            $(this).removeClass("active")
        }
        else {
            $(".opentab2>div").slideUp();
            $(".opentab2>h2").removeClass("active");
            $(this).addClass("active");
        }
        secilenid = secilenid.replace(" active", "");
        $("#" + secilenid).slideToggle();

    });

});