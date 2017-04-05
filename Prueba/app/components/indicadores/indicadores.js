'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./indicadores-view-model');

// additional functions
var viewModel = require("./charts/view-model");
var viewModel = new viewModel.ChartExamplesDataModel();


function pageLoaded(args) {
    var page = args.object;

    helpers.platformInit(page);
    page.bindingContext = viewModel;
    // additional pageLoaded


    viewModel._pieSource3 = [ 
        { Country: "Hombres", Amount: 20.0 },
        { Country: "Niños", Amount: 50.0 },
        { Country: "Mujeres", Amount: 100.0 }
    ];  

    if (isInit) {
        isInit = false;
        // additional pageInit
    }
}
exports.pageLoaded = pageLoaded;

exports.buttonTap = function (args) {
    var chart = args.object;
    helpers.navigate({
        moduleName: 'components/indicadores/charts/' + chart.chart,
        animated: true,
        transition: {
            name: "slide"
        },
    });
}