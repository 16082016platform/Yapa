'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./homeView-view-model');

var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var dataService = require('../../dataProviders/backendServices');
var color_1 = require("color");
var enums = require("ui/enums");
// additional functions

var http = require("http");

var page;
function pageLoaded(args) {
    page = args.object;

    // helpers.platformInit(page);
    // Hide the iOS UINavigationBar so it doesn't get in the way of the animation
    if (frameModule.topmost().ios) {
        frameModule.topmost().ios.navBarVisibility = "never";
    } else {
        frameModule.topmost().android.navBarVisibility = "never";
    }

    page.bindingContext = viewModel;
    // additional pageLoaded
    colorHint();
    if (isInit) {
        isInit = false;
        // additional pageInit
    }

    viewModel.set("isLoading", false);
    // Create the parallax background effect by scaling the background image
    // page.getViewById("backgroundParallax").animate({
    //     scale: { x: 1, y: 1 },
    //     duration: 8000
    // });

    limpiarTextFiled();
    page.getViewById("texto").animate({
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 400,
        curve: enums.AnimationCurve.easeOut
    }).then(function () {
        return page.getViewById("dni").animate({
            opacity: 1,
            translate: { x: 0, y: 0 },
            duration: 400,
            curve: enums.AnimationCurve.easeOut
        });
    }).then(function () {
        return page.getViewById("telefono").animate({
            opacity: 1,
            translate: { x: 0, y: 0 },
            duration: 400,
            curve: enums.AnimationCurve.easeOut
        });
    }).then(function () {
        return page.getViewById("correo").animate({
            opacity: 1,
            translate: { x: 0, y: 0 },
            duration: 400,
            curve: enums.AnimationCurve.easeOut
        });
    }).then(function () {
        return page.getViewById("seleccionar").animate({
            opacity: 1,
            translate: { x: 0, y: 0 },
            duration: 400,
            curve: enums.AnimationCurve.easeOut
        });
    }).then(function () {
        return page.getViewById("enviar").animate({
            opacity: 1,
            translate: { x: 0, y: 0 },
            duration: 400,
            curve: enums.AnimationCurve.easeOut
        });
    });

    page.getViewById("option0").color = "#ee1d23";
    page.getViewById("option1").color = "#cecece";


}
exports.pageLoaded = pageLoaded;


function colorHint() {
    var color = new color_1.Color("#cecece"),
        Email = page.getViewById("correo"),
        DisplayName = page.getViewById("telefono"),
        Username = page.getViewById("dni");
    if (page.android) {
        Email.android.setHintTextColor(color.android);
        DisplayName.android.setHintTextColor(color.android);
        Username.android.setHintTextColor(color.android);
    }
    else if (page.ios) {
        var placeholder = Email.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
        var placeholder = DisplayName.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
        var placeholder = Username.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
    }
}

function mensajeOK(responce) {
    // alert(JSON.stringify(responce));

    helpers.navigate({
        moduleName: "components/splashScreen/splashScreen",
        animated: true,
        transition: {
            name: "slide"
        },
        clearHistory: true,
    });
}
function onRequestSuccess(valor) {
    var info = ((page.getViewById("option0").color == "#cecece") ? page.getViewById("option1").text : page.getViewById("option0").text) + '<br/>Correo: ' + page.getViewById("correo").text + '<br/>Teléfono:' + page.getViewById("telefono").text + '</br>Dni:' + page.getViewById("dni").text + '</br>';

    // page.getViewById("correo").text = html;
    // "CORREO: vemalavers@unc.edu.pe<br/>TELEFONO: 986709663<br/>DNI: 46679559<br/>Crédito vehicular"

    var data = JSON.stringify({
        "TemplateName": "NotifyAdminTemplate",
        "Recipients": ["ks@doohsmedia.com"],
        "Context": {
            "NotificationSubject": "Nuevo usuario registrado en Yapa",
            "MessageBody": info
        }
    });

    var result;
    http.request({
        url: "https://api.everlive.com/v1/dmazapr96i4ocxjh/Functions/NotifyAdminTemplate",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: data
    }).then(function (response) {
        // result = response.content.toJSON();
        // alert(JSON.stringify(result));
        viewModel.set("isLoading", false);
        mensajeOK();
    }, function (e) {
        viewModel.set("isLoading", false);

        alert("Error occurred " + e);
    });
}


function onRequestFail(err) {
    // alert(JSON.stringify(err));
    errores(err);
    return err;
}

function validarTextField() {
    limpiarErrores();
    var valido = true;
    if (isNaN(page.getViewById("dni").text) || page.getViewById("dni").text.length !== 8) {
        page.getViewById("dni").color = "red";
        valido = false;
        viewModel.set('validarDni', true);
        var label = page.getViewById("validarDni");
        animarLabel(label);
    }
    if (isNaN(page.getViewById("telefono").text) || page.getViewById("telefono").text.length == 0) {
        page.getViewById("telefono").color = "red";
        valido = false;
        viewModel.set('validarTelefono', true);
        var label = page.getViewById("validarTelefono");
        animarLabel(label);
    }
    var correo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(page.getViewById("correo").text);
    if (correo) {
        // valido = true;
    } else {
        page.getViewById("correo").color = "red";
        valido = false;
        viewModel.set('validarCorreo', true);
        var label = page.getViewById("validarCorreo");
        animarLabel(label);
    }
    return valido;
}

function animarLabel(label) {
    label.translateY = "-400";
    label.animate({
        translate: { x: 0, y: 0 },
        duration: 500,
        curve: enums.AnimationCurve.spring
    })
}

// function animarLabel(label) {
//     label.animate({
//         scale: { x: 0.3, y: 0.3 },
//         duration: 2000,
//     }).then(function () {
//         return label.animate({
//             scale: { x: 1, y: 1 },
//             duration: 4000,
//             // curve: enums.AnimationCurve.spring
//         });
//     }).then(function () {
//         return label.animate({
//             translate: { x: 0, y: 0 },
//             duration: 400,
//             curve: enums.AnimationCurve.spring
//         });
//     });
// }


exports.sendEmail = function (args) {
    viewModel.set("isLoading", true);

    if (validarTextField()) {
        return dataService.Users.register(page.getViewById("correo").text, page.getViewById("dni").text, {
            Email: page.getViewById("correo").text,
            DisplayName: page.getViewById("telefono").text,
            Username: page.getViewById("dni").text,
            credito: page.getViewById("option0").color == "#cecece" ? page.getViewById("option1").text : page.getViewById("option0").text
        })
            .then(onRequestSuccess.bind(this))
            .catch(onRequestFail.bind(this));
    } else {
        viewModel.set("isLoading", false);
    }
}

function limpiarErrores() {
    page.getViewById("dni").color = "#ffffff";
    page.getViewById("telefono").color = "#ffffff";
    page.getViewById("correo").color = "#ffffff";

    // page.getViewById("validarDni").visibility = false;
    // page.getViewById("validarTelefono").visibility = false;
    // page.getViewById("validarCorreo").visibility = false;

    viewModel.set('validarDni', false);
    viewModel.set('validarTelefono', false);
    viewModel.set('validarCorreo', false);

}
function limpiarTextFiled() {
    page.getViewById("dni").text = "46679559";
    page.getViewById("telefono").text = "986709663";
    page.getViewById("correo").text = "vemalavers@unc.edu.pe";
}

function errores(err) {
    alert(JSON.stringify(err));
    viewModel.set("isLoading", false);
    switch (err.code) {
        case 201:
            alert("Error. DNI ya registrado");
            break;
        case 211:
            alert("Error. Correo ya registrado");
            break;
        default:
            alert("Ocurrio un error, inténtelo nuevamente");
            break;
    }
}


var platform_1 = require("platform");
var test;
if (platform_1.isIOS) {
    test = require("../../delegate/delegate_ios");
}
exports.maxLength = function (args) {
    var textfield = args.object;
    if (textfield.android) {
        var legth = parseInt(8);
        var array = [];
        array[0] = new android.text.InputFilter.LengthFilter(legth);
        textfield.android.setFilters(array);
    } else {
        var legth = parseInt(8);
        var uiTextView = textfield.ios;
        let tf = textfield;
        var newWeakRef = new WeakRef(uiTextView);
        let newDelegate = test.newUITextFieldDelegateImpl.initWithOriginalDelegate(tf._delegate, legth);
        uiTextView.delegate = newDelegate;
        tf._delegate = newDelegate;
    }
}

function textChange(args) {
    var textfield = args.object;
    switch (textfield.id) {
        case "dni":
            page.getViewById("dni").color = "#ffffff";
            viewModel.set('validarDni', false);
            break;
        case "telefono":
            page.getViewById("telefono").color = "#ffffff";
            viewModel.set('validarTelefono', false);
            break;
        default:
            page.getViewById("correo").color = "#ffffff";
            viewModel.set('validarCorreo', false);
            break;
    }
}
exports.textChange = textChange;


exports.seleccionar0 = function (args) {
    var option = args.object;
    option.color = "#ee1d23";
    page.getViewById("option1").color = "#cecece";
}


exports.seleccionar1 = function (args) {
    var option = args.object;
    option.color = "#ee1d23";
    page.getViewById("option0").color = "#cecece";
}
