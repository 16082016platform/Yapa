'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./homeView-view-model');

var frameModule = require("ui/frame");
var imageModule = require("ui/image");
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
        "Recipients": ["vmalaver@doohsdigital.com"],
        "Context": {
            "NotificationSubject": "Nuevo usuario registrado en Yapa",
            "MessageBody": info
        }
    });

    var result;
    http.request({
        url: "https://api.everlive.com/v1/qpxfu6xj9h2hd3d4/Functions/NotifyAdminTemplate",
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
        var tienda = new Array(6);
        tienda[0] = "067334a0-0b1d-11e7-b200-bbf17e89428c";
        tienda[1] = "01cd5340-0b1d-11e7-ac2a-ed032b886c01";
        tienda[2] = "f6f54b30-0b1c-11e7-a2db-17761183e30d";
        tienda[3] = "ef7ce8e0-0b1c-11e7-bff3-eba5aca004cc";
        tienda[4] = "e75c5fb0-0b1c-11e7-ac2a-ed032b886c01";
        tienda[5] = "55163cc0-0b1c-11e7-ac2a-ed032b886c01";

        var i = Math.floor(Math.random() * 5) + 0;


        // return dataService.Users.register(page.getViewById("correo").text, page.getViewById("dni").text, {
        //     Email: page.getViewById("correo").text,
        //     DisplayName: page.getViewById("telefono").text,
        //     Username: page.getViewById("dni").text,
        //     credito: page.getViewById("option0").color == "#cecece" ? page.getViewById("option1").text : page.getViewById("option0").text,
        //     tienda: tienda[i],
        // })
        //     .then(onRequestSuccess.bind(this))
        //     .catch(onRequestFail.bind(this));

        var solicitud = JSON.stringify({
            "numerodocumento": page.getViewById("dni").text,
            "tipodocumento": "tipoDioc",
            "credito": page.getViewById("option0").color == "#cecece" ? page.getViewById("option1").text : page.getViewById("option0").text,
            "tienda": tienda[i],
            "punto": "1",
            "correo": page.getViewById("correo").text,
            "telefono": page.getViewById("telefono").text
        });

        var result;
        http.request({
            url: "https://api.everlive.com/v1/qpxfu6xj9h2hd3d4/solicitudes",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: solicitud
        }).then(function (response) {
            onRequestSuccess();
        }, function (e) {
            onRequestFail(e);
        });

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
    page.getViewById("dni").text = "";
    page.getViewById("telefono").text = "";
    page.getViewById("correo").text = "";
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
