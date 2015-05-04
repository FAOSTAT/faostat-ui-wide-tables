define(['jquery',
        'handlebars',
        'text!faostat_ui_wide_tables/html/templates.html',
        'i18n!faostat_ui_wide_tables/nls/translate',
        'FAOSTAT_UI_COMMONS',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, Commons) {

    'use strict';

    function WIDE_TABLES() {

        this.CONFIG = {

            lang: 'en',
            lang_faostat: 'E',
            placeholder_id: 'faostat_ui_wide_tables',
            prefix: 'faostat_ui_wide_tables_'

        };

    }

    WIDE_TABLES.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

    };

    return WIDE_TABLES;

});