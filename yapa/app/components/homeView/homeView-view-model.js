'use strict';
var ViewModel,
    Observable = require('data/observable').Observable;
ViewModel = new Observable({
    isLoading: false,
    pageTitle: 'Home View',
    // additional properties
    validarDni: false,
    validarTelefono: false,
    validarCorreo: false,
});
module.exports = ViewModel;