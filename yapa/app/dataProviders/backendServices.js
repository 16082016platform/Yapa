var provider,
    TelerikBackendServices = require('../everlive/everlive.all.min');

provider = new TelerikBackendServices({
    offlineStorage: true,
    appId: 'qpxfu6xj9h2hd3d4',
    scheme: 'https'
});

// START_CUSTOM_CODE_backendServices
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_backendServices
module.exports = provider;