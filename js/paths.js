define(function() {

    var config = {
        paths: {
            FAOSTAT_UI_WIDE_TABLES: 'faostat-ui-wide-tables',
            faostat_ui_wide_tables: '../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

    return config;

});