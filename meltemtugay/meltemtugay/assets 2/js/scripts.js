var apiURL = "https://api.hiwellapp.com/api/";
if(getLanguage()=="tr-TR"){
    var apiURL = "https://api-tr.hiwellapp.com/api/";
}
function getLanguage() {
    const url = window.location.href.toString().split("/").map(segment => segment.toLowerCase());

    const languageMap = {
        "en": "en-US",
        "el": "el-GR",
        "az": "az-Latn",
        "ro": "ro-RO",
        "pt-br": "pt-BR",
        "pt-pt": "pt-PT",
        "es-es": "es-ES",
        "es-mx": "es-MX",
        "it": "it-IT",
        "fr": "fr-FR"
    };

    for (const key in languageMap) {
        if (url.includes(key)) {
            return languageMap[key];
        }
    }

    return "tr-TR"; // default
}
localStorage.setItem("url", document.location.href), jQuery.event.special.touchstart = {
    setup: function(e, t, n) {
        this.addEventListener("touchstart", n, {
            passive: !t.includes("noPreventDefault")
        })
    }
}, jQuery.event.special.touchmove = {
    setup: function(e, t, n) {
        this.addEventListener("touchmove", n, {
            passive: !t.includes("noPreventDefault")
        })
    }
};
var cookieManager = {
    getCookie: function(e) {
        for (var t = e + "=", n = decodeURIComponent(document.cookie).split(";"), a = 0; a < n.length; a++) {
            for (var o = n[a];
                 " " === o.charAt(0);) o = o.substring(1);
            if (0 === o.indexOf(t)) return o.substring(t.length, o.length)
        }
        return null
    },
    setCookie: function(e, t, n, a) {
        var o = "";
        if (a) {
            var c = new Date;
            c.setTime(c.getTime() + 24 * a * 60 * 60 * 1e3), o = "; expires=" + c.toUTCString()
        }
        var r = e + "=" + t + o + "; path=/; max-age=900;";
        n && (r += "domain=" + (n = n || window.location.hostname)), document.cookie = r
    },
    deleteCookie: function(e) {
        document.cookie = e + "=; Max-Age=-99999999;Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
};


var localStorageManager = {
    getItem: function(key) {
        var item = localStorage.getItem(key);
        return item;
    },

    setItem: function(key, value, expiryDays) {

        if (expiryDays) {
            var expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
            itemData.expiry = expiryDate.toISOString();
        }

        localStorage.setItem(key, value);
    },

    deleteItem: function(key) {
        localStorage.removeItem(key);
    },

    clearExpiredItems: function() {
        var now = new Date();
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var itemData = JSON.parse(localStorage.getItem(key));
            if (itemData && itemData.expiry && new Date(itemData.expiry) <= now) {
                localStorage.removeItem(key);
                i--;
            }
        }
    }
};


function getLangKey(e, t = []) {
    let n = langKeys[e] || e;
    if (t.length > 0)
        for (let e = 0; e < t.length; e++) {
            const a = `{${e}}`;
            n = n.replace(a, t[e])
        }
    return n
}

function declareAnswerChange() {
    $(".choice-answer").click((function(e) {
        setTimeout((() => {
            onNextPage()
        }), 500)
    }))
}
var countryFormat = function(e, t) {
        if (!e.id) return e.text - $(e.element).attr("data-text");
        var n = $("<img>", {
                class: "img-flag",
                width: 18,
                src: "/assets/images/flags/" + $(e.element).attr("data-countryCode") + ".svg"
            }),
            a = $("<span>", {
                text: " " + $(e.element).attr("data-text")
            });
        return a.prepend(n), a
    },
    stickItHeader = function() {
        $(window).scrollTop() >= 100 ? ($("#header .navbar").addClass("on-scroll"), $("#header .eq-banner").hide()) : ($("#header .navbar").removeClass("on-scroll"), $("#header .eq-banner").show())
    };

function registerLanguageComboboxHandler() {
    let e;

    function t(e) {
        setLangCookie(e), Mixpanel.Track("language_change", e);
        let t = $(`link[rel='alternate'][hreflang='${e}']`);
        if (t && t.length > 0) {
            let e = t.attr("href");
            window.location = e
        } else window.location = "tr" != e ? "/" + e : "/"
    }
    $(".cblang").click((function() {
        e = $(this).attr("value"), t(e)
    })), $("#cbLang").change((function() {
        e = $(this).val(), t(e)
    }))
}

function setLangCookie(e) {
    const t = new Date(Date.now() + 15552e6).toUTCString();
    document.cookie = "lang=" + encodeURIComponent(e) + "; expires=" + t + "; path=/; domain=.hiwellapp.com"
    
}

function checkboxDisplay() {
    1 === getCountry() ? ($("#en-checkbox").addClass("d-none"), $("#tr-checkbox").removeClass("d-none")) : ($("#tr-checkbox").addClass("d-none"), $("#en-checkbox").removeClass("d-none"))
}



function getCountry() {
    const e = localStorageManager.getItem("therapyLanguage");
    var t;
    switch (Number(e)) {
        case 1:
            t = 1;
            break;
        case 2:
            t = 6;
            break;
        case 3:
            t = 5;
            break;
        case 4:
            t = 7;
            break;
        case 6:
            t = 11;
            break;
        case 9:
            t = 21;
            break;
        case 10:
            t = 15;
            break;
        case 11:
            t = 33;
            break;
        case 12:
            t = 24;
            break;
        case 13:
            t = 44;
            break;
        case 14:
            t = 39
    }
    return t
}

function getUrlVars() {
    var e, t = {},
        n = localStorage.getItem("url"),
        a = n.indexOf("?");
    if (a > 0)
        for (var o = n.slice(a + 1).split("&"), c = 0; c < o.length; c++) t[(e = o[c].split("="))[0]] = e[1];
    return t
}

function showLoader() {
    $("div.spanner").addClass("show"), $("div.overlay").addClass("show")
}

function hideLoader() {
    $("div.spanner").removeClass("show"), $("div.overlay").removeClass("show")
}

function checkPrivacyTest() {
    let e;
    return e = $("#privacy-test-check").is(":checked"), e
}
$((function() {
    registerLanguageComboboxHandler();
    setInterval(stickItHeader, 100);
    $("#emergency-contact-button").click((function() {
        $("#emergencyModal").modal("show")
    })), $("#emergency-contact-close-button").click((function() {
        $("#emergencyModal").modal("hide")
    })), window.location.href.indexOf("how-it-works") > -1 && $([document.documentElement, document.body]).animate({
        scrollTop: $("#how-it-works").offset().top
    }, 800), $("body").on("click", ".scroll-page-link", (function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#how-it-works").offset().top
        }, 800)
    })), $(".menu").on("click", (function(e) {
        $(this).toggleClass("opened")
    })), $("#get-started").submit((function() {
        return !1
    })), $("#fullname").change((() => {
        if ($("#fullname").val().length > 20) {
            const e = getLangKey("JS_Fullname_Length_Error");
            document.getElementById("name-container").setAttribute("data-error", e)
        } else checkUsernameValid()
    })), $("#fullname").keydown((() => {
        document.getElementById("name-container").removeAttribute("data-error")
    })), $("#password-show-check input").change((function() {
        $(this).prop("checked") ? $(this).parents(".form-group").find(".form-control").attr("type", "text") : $(this).parents(".form-group").find(".form-control").attr("type", "password")
    })), $("#email").change((function() {
        document.getElementById("email-container").removeAttribute("data-error")
    })), $("#password").change((function() {
        const e = document.getElementById("password").value,
            t = e.length > 9,
            n = new Set(e).size > 5;
        if (t && n) document.getElementById("password-container").removeAttribute("data-error");
        else {
            const e = getLangKey("JS_Password_Requirtment_Error");
            document.getElementById("password-container").setAttribute("data-error", e)
        }
    })), $("#password").keypress((() => {
        document.getElementById("password-container").removeAttribute("data-error")
    })), $(document).ready((() => {
        try {
            const e = "tr-TR" == getLanguage() ? 90 : 44;
            document.getElementById("country").value = e
        } catch (e) {}
    })), $(document).ready((function() {
        try {
            $("#register-button").on("click", (function(e) {
                try {
                    sendEmail(!0)
                } catch (e) {
                    console.log(e)
                }
                return !1
            })), console.log("Registered submit handler.")
        } catch (e) {
            console.log(e)
        }
    })), $(document).ready((function() {
        try {
            $("#contact-form").on("submit", (function(e) {
                try {
                    const e = document.getElementById("contactName").value,
                        t = document.getElementById("email").value,
                        n = document.getElementById("message").value,
                        a = document.getElementById("country").value,
                        o = {
                            name: e,
                            email: t,
                            phone: "+" + a + document.getElementById("phone").value,
                            message: n
                        };
                    return jQuery.ajax({
                        type: "post",
                        url: apiURL + "website/SendContactEmail",
                        headers: {
                            "Accept-Language": getLanguage()
                        },
                        data: JSON.stringify(o),
                        contentType: "application/json; charset=utf-8",
                        traditional: !0,
                        success: function(e) {
                            e.success && (swal({
                                html: getLangKey("JS_Contact_Form_Success")
                            }), $(".alert").removeClass("d-none"), $(".contact-submit-button").addClass("disabled"), Mixpanel.Track("contact_form_submit_success", ""));
                            e.error && swal({
                                text: e.error.displayMessage
                            })
                        }
                    }), !1
                } catch (e) {
                    console.log(e)
                }
                return !1
            })), console.log("Contact submit handler.")
        } catch (e) {
            console.log(e)
        }
    })), $(document).ready((function() {
        try {
            $("#syntonym-contact-form").on("submit", (function(e) {
                try {
                    const e = document.getElementById("contactName").value,
                        t = document.getElementById("email").value,
                        n = document.getElementById("message").value,
                        a = document.getElementById("country").value,
                        o = {
                            name: e,
                            email: t,
                            phone: "+" + a + document.getElementById("phone").value,
                            message: "[Syntonym Lead Form]" + n
                        };
                    return jQuery.ajax({
                        type: "post",
                        url: apiURL + "website/SendContactEmail",
                        headers: {
                            "Accept-Language": getLanguage()
                        },
                        data: JSON.stringify(o),
                        contentType: "application/json; charset=utf-8",
                        traditional: !0,
                        success: function(e) {
                            e.success && ($("#successModal").modal("show"), $(".alert").removeClass("d-none"), $(".contact-submit-button").addClass("disabled"), Mixpanel.Track("syntonym_form_submit_success", "")), e.error && swal({
                                text: e.error.displayMessage
                            })
                        }
                    }), !1
                } catch (e) {
                    console.log(e)
                }
                return !1
            })), console.log("Contact submit handler.")
        } catch (e) {
            console.log(e)
        }
    })), $(document).ready((function() {
        try {
            $("#psychologist-apply-form").on("submit", (function(e) {
                try {
                    if (function() {
                        let e;
                        return e = document.getElementById("privacyAccepted").checked, e
                    }()) {
                        $(".privacyAceppted").removeClass("text-danger"), Loader.Show(".contact-submit-button");
                        const e = document.getElementById("name").value,
                            o = document.getElementById("surname").value,
                            c = document.getElementById("email").value,
                            r = document.getElementById("phone").value,
                            s = document.getElementById("website").value,
                            l = document.getElementById("socialMediaProfile").value,
                            i = document.getElementById("bachelorMajor").value,
                            d = document.getElementById("bachelorUniversity").value,
                            u = document.getElementById("bachelorStartYear").value,
                            m = document.getElementById("bachelorEndYear").value,
                            g = document.getElementById("masterMajor").value,
                            p = document.getElementById("masterUniversity").value,
                            y = document.getElementById("masterStartYear").value,
                            h = document.getElementById("masterEndYear").value,
                            f = document.getElementById("speciality").value,
                            v = $("#therapyLanguages").val(),
                            b = document.getElementById("file");
                        document.getElementById("privacyAccepted").value;
                        var t, n;
                        const k = b.files[0];
                        if (k) {
                            var a = k.name;
                            if ((t = a.split(".").pop().toLowerCase()).length > 5 || t.length < 1) return void alert("Dosya uzantısı geçersiz.");
                            const b = new FileReader;
                            b.readAsDataURL(k), b.onload = function() {
                                n = b.result.split(",")[1];
                                const a = {
                                    name: e,
                                    surname: o,
                                    email: c,
                                    phone: r,
                                    website: s,
                                    socialMediaProfile: l,
                                    bachelorMajor: i,
                                    bachelorUniversity: d,
                                    bachelorStartYear: u,
                                    bachelorEndYear: m,
                                    masterMajor: g,
                                    masterUniversity: p,
                                    masterStartYear: y,
                                    masterEndYear: h,
                                    speciality: f,
                                    therapyLanguages: v,
                                    fileExtension: t,
                                    fileContentBase64: n,
                                    privacyAccepted: !0
                                };
                                return console.log(a), jQuery.ajax({
                                    type: "post",
                                    url: apiURL + "Provider/Apply",
                                    headers: {
                                        "Accept-Language": getLanguage()
                                    },
                                    data: JSON.stringify(a),
                                    contentType: "application/json; charset=utf-8",
                                    traditional: !0,
                                    success: function(e, t, n) {
                                        if (n && n.status === 200) {
                                            swal({
                                                text: getLangKey("JS_Psyhcologist_Apply_Success"),
                                                confirmButtonText: getLangKey("Ok")
                                            });
                                            Mixpanel.Track("psychologist_apply_form_submit_success", "");
                                            $("#therapyLanguages").val(null).trigger("change");
                                            document.getElementById("psychologist-apply-form").reset();
                                            $("#psychologist-submit-btn").prop("disabled", true);
                                            Loader.Hide(".contact-submit-button");
                                        } else {
                                            Loader.Hide(".contact-submit-button");
                                            swal({
                                                text: getLangKey("JS_Psyhcologist_Apply_Error"),
                                                confirmButtonText: getLangKey("Ok")
                                            });
                                        }
                                    },
                                    error: function(e) {
                                        console.log(e);
                                        swal({
                                            text: getLangKey("JS_Psyhcologist_Apply_Error"),
                                            confirmButtonText: getLangKey("Ok")
                                        });
                                    }
                                }), !1
                            }
                        }
                    } else $(".privacyAceppted").addClass("text-danger")
                } catch (e) {
                    console.log(e)
                }
                return !1
            })), console.log("Contact submit handler.")
        } catch (e) {
            console.log(e)
        }
    })), $(document).ready((function() {
        try {
            $("#business-form").on("submit", (function(e) {
                try {
                    const e = document.getElementById("contactName").value,
                        n = document.getElementById("email").value,
                        a = document.getElementById("country").value,
                        o = document.getElementById("phone").value,
                        c = document.getElementById("companyName").value,
                        r = document.getElementById("titleInCompany").value,
                        s = document.getElementById("companySize").value;
                    var t = [];
                    t = [], $.each($("input[name='enterpriseServices']:checked"), (function() {
                        t.push($(this).val())
                    }));
                    const l = document.getElementById("message").value,
                        i = {
                            name: e,
                            email: n,
                            phone: "+" + a + o,
                            companyName: c,
                            titleInCompany: r,
                            companySize: s,
                            enterpriseServices: t.toString(),
                            message: l
                        };
                    return jQuery.ajax({
                        type: "post",
                        url: apiURL + "website/send-business-contact-email",
                        data: JSON.stringify(i),
                        headers: {
                            "Accept-Language": getLanguage()
                        },
                        contentType: "application/json; charset=utf-8",
                        traditional: !0,
                        success: function(e) {
                            e.success && ($("#business-form").hide(), $("#successBusiness").removeClass("d-none"), Mixpanel.Track("business_form_submit_success", "")), e.error && swal({
                                text: e.error.displayMessage
                            })
                        }
                    }), !1
                } catch (e) {
                    console.log(e)
                }
                return !1
            })), console.log("Contact submit handler.")
        } catch (e) {
            console.log(e)
        }
    })), $(".contact-number-input").change((function(e) {
        var t = $(this).val();
        if (!$.isNumeric(t)) {
            const e = getLangKey("JS_Number_Valid_Error");
            document.getElementById("phone").setCustomValidity(e), document.getElementById("phone").reportValidity()
        }
    })), $("#contact-success-close-button").click((function() {
        $("#successModal").modal("hide")
    })), $("#result-success-close-button").click((function() {
        $("#resultModal").modal("hide")
    }))
})), $(".test-question-box .radio-input").on("change", (function() {
    var e = $(this).closest(".test-question-box").next();
    0 !== e.length && $("html, body").animate({
        scrollTop: e.offset().top - 150
    }, 500)
})), $("#psychologist-banner-view-all-btn").on("click", (function() {
    var e = $("#psychologist-list");
    $("html, body").animate({
        scrollTop: e.offset().top - 150
    }, 500)
})), $("#donate-page-hero-btn").on("click", (function() {
    var e = $("#donate-section");
    $("html, body").animate({
        scrollTop: e.offset().top - 150
    }, 500)
})), $(".table-of-contents a").on("click", (function() {
    var e = $(this).attr("href");
    $("html, body").animate({
        scrollTop: $(`${e}`).offset().top - 95
    }, 500)
}));
var testResponseList = [];

function completeTest(e) {
    testResponseList = [];
    var t = checkPrivacyTest();
    const n = document.getElementsByClassName("accordion-item");
    for (let e of n) {
        if (e.classList.contains("non-api-question")) continue;
        const t = e.getElementsByClassName("form-group");
        for (let e of t) {
            const t = e.getElementsByTagName("input")[0],
                n = t.getAttribute("name").replace("q", ""),
                a = t.getAttribute("id").replace(`q${n}-a`, "");
            t.checked && testResponseList.push({
                questionId: Number(n),
                answerId: Number(a)
            })
        }
    }
    testResponseList.length == n.length && 1 == t ? $("#resultModal").modal("show") : swal({
        text: getLangKey("JS_ErrorAnswerAll")
    });
    return !1
}

function checkUsernameRequired() {
    const e = document.getElementById("fullname").value;
    return "" != e && null != e
}

function checkPasswordRequired() {
    const e = document.getElementById("password").value,
        t = e.length > 9,
        n = new Set(e).size > 5;
    return t && n
}

function checkEmailRequired() {
    const e = document.getElementById("email").value;
    return "" != e && null != e
}

function checkPermissionRequired() {
    return checkGdprRequired() && checkPolicyRequired()
}

function checkGdprRequired() {
    let e;
    return e = 1 === getCountry() ? document.getElementById("gdprCheck-tr").checked : document.getElementById("gdprCheck-en").checked, e
}

function checkPolicyRequired() {
    let e;
    return e = 1 === getCountry() ? document.getElementById("policyCheck-tr").checked : document.getElementById("policyCheck-en").checked, e
}

function checkGdprRequiredContractPage() {
    let e;
    return e = 1 === getCountry() ? document.getElementById("gdprCheck-tr-contract-page").checked : document.getElementById("gdprCheck-en-contract-page").checked, e
}

function checkPolicyRequiredContractPage() {
    let e;
    return e = 1 === getCountry() ? document.getElementById("policyCheck-tr-contract-page").checked : document.getElementById("policyCheck-en-contract-page").checked, e
}
if ($("#calculateTestResult").submit((function(e) {
    e.preventDefault(), $("#calculateTestResult").find(".btn").attr("disabled", !0), userAnswers = testResponseList;
    const t = document.getElementById("email").value;
    testId = $("input[type=hidden]").val();
    const n = {
        email: t,
        testId: Number(testId),
        userAnswers: userAnswers
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: apiURL + "website/self-help-test/result-v2",
        data: JSON.stringify(n),
        contentType: "application/json",
        headers: {
            "Accept-Language": getLanguage()
        },
        traditional: !0,
        success: function(e) {
            200 == e.code && ($("#calculateTestResult").addClass("d-none"), $("#testSuccessText").removeClass("d-none"), Mixpanel.Track("complete_text_success", "")), e.error && ($("#calculateTestResult").addClass("d-none"), $("#testErrorText").html(e.error.displayMessage), $("#testErrorText").removeClass("d-none"), $("#calculateTestResult").find(".btn").attr("disabled", !1), Mixpanel.Track("complete_text_error", e.error.displayMessage))
        },
        error: function(e) {}
    })
})), window.location.href.indexOf("randevu-durumu") > -1 || window.location.href.indexOf("appointment-status") > -1) {
    function appointmentAccept() {
        const e = {
            hashCode: $("#appointmentCode").val(),
            reasonId: 0,
            willAttend: !0
        };
        jQuery.ajax({
            type: "post",
            url: apiURL + "website/cancel-appointment",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            headers: {
                "Accept-Language": getLanguage()
            },
            traditional: !0,
            success: function(e) {
                $("#appointment-detail-area").addClass("d-none"), $("#appointment-accept-area").removeClass("d-none")
            },
            error: function(e) {
                swal({
                    text: getLangKey("JS_AppointmentStatus_Invalid_Error")
                })
            }
        })
    }

    function appointmentCancel() {
        $("#appointment-detail-area").addClass("d-none"), $("#appointment-cancel-area").removeClass("d-none")
    }

    function appointmentCancelSubmit() {
        const e = $("#appointmentCode").val(),
            t = document.querySelector('input[name="appointmentCancelReason"]:checked').value,
            n = {
                hashCode: e,
                reasonId: Number(t),
                willAttend: !1
            };
        jQuery.ajax({
            type: "post",
            url: apiURL + "website/cancel-appointment",
            data: JSON.stringify(n),
            contentType: "application/json; charset=utf-8",
            headers: {
                "Accept-Language": getLanguage()
            },
            traditional: !0,
            success: function(e) {
                $("#appointment-cancel-area").addClass("d-none"), $("#appointment-accept-area").removeClass("d-none"), $("#appointment-accept-area").find("p").addClass("d-none")
            },
            error: function(e) {
                swal({
                    text: getLangKey("JS_AppointmentStatus_Invalid_Error")
                })
            }
        })
    }
    $(document).ready((() => {
        const e = getUrlVars(window.location.href),
            t = decodeURI(e.d).replaceAll("+", " "),
            n = decodeURI(e.cn).replaceAll("+", " "),
            a = decodeURI(e.cid).replaceAll("+", " "),
            o = e.code,
            c = decodeURI(e.p).replaceAll("+", " ");
        t && n && a && o && c && ($("#appointmentDate").text(t), $("#appointmentClient").text(`${n} (${a})`), $("#appointmentProvider").text(c), $("#appointmentCode").val(o))
    })), $(".appointment-cancel-reasons .radio-input").on("change", (function() {
        $("#appointment-cancel-btn").removeClass("disabled")
    }))
}

function swal({
                  title: e = "",
                  text: t = "",
                  icon: n = "",
                  html: a = ""
              }) {
    Swal.fire({
        title: e,
        text: t,
        html: a,
        iconHtml: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3268F3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        confirmButtonText: "tr-TR" == getLanguage() ? "Tamam" : "OK",
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-danger"
        }
    })
}
const Mixpanel = {
    Identify: e => {
        try {
            mixpanel.identify(e)
        } catch (e) {
            console.error(e)
        }
    },
    Register: e => {
        try {
            mixpanel.register({
                userId: e.id,
                Name: e.firstName,
                Surname: e.lastName,
                Email: e.email
            })
        } catch (e) {
            console.error(e)
        }
    },
    People: {
        Set: e => {
            mixpanel.people.set(e)
        },
        SetOnce: e => {
            mixpanel.people.set_once(e)
        },
        Append: e => {
            mixpanel.people.append(e)
        },
        DeleteUser: () => {
            mixpanel.people.delete_user()
        },
        Remove: e => {
            mixpanel.people.remove(e)
        }
    },
    Track: (e, t) => {
        try {
            mixpanel.track(e, {
                trackProperty: t
            })
        } catch (e) {
            console.error(e)
        }
    }
};
$("[data-mixpanel-name]").click((function() {
    var e = $(this),
        t = e.data("mixpanel-name"),
        n = e.data("mixpanel-property");
    Mixpanel.Track(t, n)
}));
const Loader = {
    Show: e => {
        if (e) {
            const t = '\n\t\t  <div class="bn-calendar-loading loader-abs">\n\t\t\t<div class="spinner-grow text-primary" role="status">\n\t\t\t  <span class="sr-only"></span>\n\t\t\t</div>\n\t\t  </div>';
            $(e).append(t)
        }
    },
    Hide: e => {
        if (e) {
            const t = $(e).find(".bn-calendar-loading");
            t && t.remove()
        }
    }
};
if ($("#blog-content-area").length > 0) {
    var blogScrollHeight = document.getElementById("blog-content-area").scrollHeight;
    const e = blogScrollHeight,
        t = document.getElementById("progressbar");
    window.onscroll = function() {
        $(window).scrollTop() > 200 ? $("#progressbar-container").show() : $("#progressbar-container").hide();
        const n = window.scrollY / e * 100;
        t.style.width = n - 5 + "%"
    }
}

function sendGTMEvent(e, t = null) {
    window.dataLayer = window.dataLayer || [];
    var gID = "G-VR0K56JQYJ";
    function gtag() { dataLayer.push(...arguments); } // burada düzeltme yaptık
    gtag('js', new Date());
    gtag('config', gID);

    var n = {
        event: e,
        language: 'tr',
    };

    if (t !== null) {
        Object.keys(t).forEach((key) => {
            n[key] = t[key];
        });
    }

    gtag("event", e, n);
}
$(document).ready((function() {
    if (screen.width < 768 && $(".blog-toc-list").length > 0) {
        var e = $(".blog-toc-list").html();
        $("#blog-content-area").prepend('<div class="blog-toc-list-mobile d-md-none">' + e + "</div>"), $(".blog-toc-list-mobile .table-of-contents-title, .blog-toc-list-mobile .table-of-contents a").on("click", (function() {
            $(".table-of-contents").slideToggle()
        }))
    }
})), $(document).ready((function() {
    $(document).on("click", ".send-event", (function() {
        sendGTMEvent($(this).data("event-name"), $(this).data("event-parameters"))
    }))
}));


if ($(".how-it-works-section-v2").length > 0) {
    document.addEventListener('scroll', function() {
        const steps = document.querySelectorAll('.how-it-works-box-v2');
        const timeline = document.querySelector('.vertical-timeline::after');
        let activeIndex = 0;
        steps.forEach((step, index) => {
            const rect = step.getBoundingClientRect();

            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                activeIndex = index;
            }
        });
        const fillHeight = ((activeIndex + 1) / steps.length) * 100;
        document.querySelector('.vertical-timeline').style.setProperty('--fill-height', `${fillHeight}%`);
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            sectionHeight = steps[index].offsetHeight;
            item.classList.toggle('active', index === activeIndex);
            item.style.height = `${sectionHeight+20}px`;
        });
    });
}