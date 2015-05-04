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
            data: null,
            lang_faostat: 'E',
            cols_dimension: 'Year',
            rows_dimension: 'GUNFItemNameE',
            prefix: 'faostat_ui_wide_tables_',
            placeholder_id: 'faostat_ui_wide_tables'

        };

    }

    WIDE_TABLES.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

        /* Initiate variables. */
        var cols_dimension = [];
        var rows_dimension = [];
        var codes_buffer = [];

        for (var i = 0 ; i < this.CONFIG.data.length ; i++) {
            if ($.inArray(this.CONFIG.data[i][this.CONFIG.cols_dimension], cols_dimension) < 0) {
                cols_dimension.push(this.CONFIG.data[i][this.CONFIG.cols_dimension]);
            }
            if ($.inArray(this.CONFIG.data[i].UNFCCCCode, codes_buffer) < 0) {
                codes_buffer.push(this.CONFIG.data[i].UNFCCCCode);
                var values = [];
                for (var j = 0 ; j < this.CONFIG.data.length ; j++) {
                    if (this.CONFIG.data[j].UNFCCCCode == this.CONFIG.data[i].UNFCCCCode) {
                        values.push(parseFloat(this.CONFIG.data[j].GUNFValue) > -1 ? parseFloat(this.CONFIG.data[j].GUNFValue).toFixed(2) : null);
                    }
                }
                rows_dimension.push({
                    code: this.CONFIG.data[i].UNFCCCCode,
                    label: this.CONFIG.data[i].GUNFItemNameE,
                    values: values
                });
            }
        }

        /* Load template. */
        var source = $(templates).filter('#faostat_ui_wide_tables_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            cols_dimension: cols_dimension,
            rows_dimension: rows_dimension,
            body: [123, 234, 456]
        };
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).empty().html(html);

    };

    return WIDE_TABLES;

});