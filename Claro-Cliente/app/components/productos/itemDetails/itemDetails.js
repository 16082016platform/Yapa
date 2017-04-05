var helpers = require('../../../utils/widgets/helper'),
    dialogs = require('ui/dialogs'),
    dataService = require('../../../dataProviders/backendServices'),
    viewModel = require('../productos-view-model');

/*Mis vars*/
var common = require('~/common.js');
var enums = require("ui/enums");
var http = require("http");
var vmPlanes = require('../../planes/planes-view-model');
var frameModule = require("ui/frame");
var color_1 = require("color");
/* */

var page;
function navigatedTo(args) {
    page = args.object;

    if (frameModule.topmost().ios) {
        frameModule.topmost().ios.navBarVisibility = "never";
    }

    page.bindingContext = page.navigationContext;

    var imagen = page.getViewById("imagen");
    viewModel.set("modal", false);
    common.startCount(imagen);
    colorHint();

    var planes = vmPlanes.get("listItems");
    var repeater = page.getViewById("planes");
    var array = [];
    for (var i = 0; i < planes.length; i++) {
        array.push(i);
    }
    repeater.items = array;
    repeater.refresh();
    var footer = page.getViewById("footer");
    footer.animate({
        scale: { x: 0, y: 0 },
        duration: 0,
        opacity: 0,
        curve: enums.AnimationCurve.easeIn
    }).then(function () {
        footer.animate({
            scale: { x: 1, y: 1 },
            duration: 1000,
            opacity: 1,
            curve: enums.AnimationCurve.easeIn
        });
    }).then(function () {
        for (var i = 0; i < planes.length; i++) {
            page.getViewById('nombrePlan' + i).text = planes[i].details.nombre;
            page.getViewById('precioPlan' + i).text = planes[i].details.precio;
            page.getViewById('minutosPlan' + i).text = planes[i].details.minutos;
            page.getViewById('megasPlan' + i).text = planes[i].details.internet;
            page.getViewById('lineaPlan' + i).text = planes[i].details.rpc;
            page.getViewById('mensajesPlan' + i).text = planes[i].details.sms;
        }
    });
}
exports.navigatedTo = navigatedTo;


exports.buttonBackTap = function () {
    // common.stopCount();
    helpers.back();
}

function validarTextField() {
    limpiarErrores();
    var valido = true;
    if (isNaN(page.getViewById("telefono").text) || page.getViewById("telefono").text.length == 0) {
        page.getViewById("telefono").color = "#000000";
        valido = false;
        animarLabel(page.getViewById("telefono"));
    }
    return valido;
}

function limpiarErrores() {
    page.getViewById("telefono").color = "#ffffff";
}

function animarLabel(label) {
    label.translateX = "-200";
    label.animate({
        translate: { x: 0, y: 0 },
        duration: 500,
        curve: enums.AnimationCurve.spring
    })
}

var platform_1 = require("platform");
var test;
if (platform_1.isIOS) {
    test = require("../../../delegate/delegate_ios");
}
exports.maxLength = function (args) {
    var textfield = args.object;
    if (textfield.android) {
        var legth = parseInt(9);
        var array = [];
        array[0] = new android.text.InputFilter.LengthFilter(legth);
        textfield.android.setFilters(array);
    } else {
        // var legth = parseInt(8);
        // var uiTextView = textfield.ios;
        // let tf = textfield;
        // var newWeakRef = new WeakRef(uiTextView);
        // let newDelegate = test.newUITextFieldDelegateImpl.initWithOriginalDelegate(tf._delegate, legth);
        // uiTextView.delegate = newDelegate;
        // tf._delegate = newDelegate;


        // newUITextFieldDelegateImpl.prototype.textFieldShouldChangeCharactersInRangeReplacementString = function (textField, range, replacementString) {
        //     console.log(this.maxlegth);
        //     if ((this.maxLength <= textField.text.length) && (replacementString.length > range.length)) {
        //         return false;
        //     }
        //     return this._originalDelegate.textFieldShouldChangeCharactersInRangeReplacementString(textField, range, replacementString);
        // };
    }
}

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

        var info = 'Teléfono:' + page.getViewById("telefono").text;

        var data = JSON.stringify({
            "TemplateName": "NotifyAdminTemplate",
            "Recipients": ["vmalaver@letrecorp.com"],
            "Context": {
                "NotificationSubject": "Nueva solicitud CLARO",
                "MessageBody": info
            }
        });

        var result;
        http.request({
            url: "https://api.everlive.com/v1/dvgwf7scwle8vf7j/Functions/NotifyAdminTemplate",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: data
        }).then(function (response) {
            viewModel.set("isLoading", false);
            mensajeOK();
        }, function (e) {
            viewModel.set("isLoading", false);

            alert("Error occurred " + e);
        });
    } else {
        viewModel.set("isLoading", false);
    }
}

function mensajeOK(responce) {
    helpers.navigate({
        moduleName: "components/splashScreen/splashScreen",
        animated: true,
        transition: {
            name: "slide"
        },
        clearHistory: true,
    });
}

exports.getPlanes = function (args) {


    // for (var i = 0; i < planes.length; i++) {
    //     page.getViewById('nombrePlan'+i).text=planes[i].details.nombre;
    //     page.getViewById('precioPlan'+i).text=planes[i].details.precio;
    //     page.getViewById('minutosPlan'+i).text=planes[i].details.minutos;
    //     page.getViewById('megasPlan'+i).text=planes[i].details.megas;
    //     page.getViewById('lineaPlan'+i).text=planes[i].details.linea;
    //     page.getViewById('mensajesPlan'+i).text=planes[i].details.mensajes;
    // }
}


function onListViewItemTap(args) {
    var item = args.object;
    var itemData = vmPlanes.get('listItems')[item.index];
    var planes = vmPlanes.get("listItems");
    for (var i = 0; i < planes.length; i++) {
        page.getViewById('contenedor4-' + i).cssClass = "contenedor4";
    }
    item.cssClass = "contenedor4-selected"

    page.getViewById("precioEquipo").text = "99";
    page.getViewById("etiquetaEquipo").text = "En el plan postpago " + itemData.details.nombre + " con un acuerdo de equipos a 18 meses.";
}
exports.onListViewItemTap = onListViewItemTap;

exports.showModal = function (args) {
    animarModal();
}


exports.hideModal = function () {
    animarModal(1);
}

function colorHint() {
    var color = new color_1.Color("#000000"),
        telefono = page.getViewById("telefono");
    if (page.android) {
        telefono.android.setHintTextColor(color.android);
    }
    else if (page.ios) {
        var placeholder = telefono.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
    }
}


function animarModal(tipo) {
    var modal = page.getViewById("modal");
    switch (tipo) {
        case 1:
            modal.animate({
                opacity: 1,
                scale: { x: 1.3, y: 1.3 },
                duration: 100,
            }).then(function () {
                return modal.animate({
                    scale: { x: 0, y: 0 },
                    opacity: 0,
                    duration: 300
                });

            }).then(function () {
                page.getViewById("contentModal").visibility = "collapsed";
                page.getViewById("bgModal").visibility = "collapsed";
            });
            break;
        default:
            modal.animate({
                opacity: 0,
                scale: { x: 0, y: 0 },
                duration: 0,
            }).then(function () {
                page.getViewById("bgModal").visibility = "visible";
                page.getViewById("contentModal").visibility = "visible";
                return modal.animate({
                    scale: { x: 1.3, y: 1.3 },
                    opacity: 0.7,
                    duration: 150
                });
            }).then(function () {
                return modal.animate({
                    scale: { x: 1, y: 1 },
                    opacity: 1,
                    duration: 100
                });
            });
            break;
    }
}

exports.cambiarImagen = function(args){
    var item = args.object;
    alert(item.col); 
}
