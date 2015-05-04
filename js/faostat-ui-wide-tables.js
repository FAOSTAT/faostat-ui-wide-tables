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

            lang            :   'en',
            data            :   null,
            lang_faostat    :   'E',

            show_row_code   :   true,
            row_code        :   null,
            row_label       :   null,
            cols_dimension  :   null,
            value_dimension :   null,

            prefix          :   'faostat_ui_wide_tables_',
            placeholder_id  :   'faostat_ui_wide_tables'

        };

    }

    WIDE_TABLES.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Check configuration. */
        try {

            /* Check configuration. */
            this.check_configuration();

            /* Fix the language, if needed. */
            this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

            /* Store FAOSTAT language. */
            this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

            /* Initiate variables. */
            var cols_dimension = [];
            var rows_dimension = [];
            var codes_buffer = [];

            /* Iterate over the values. */
            for (var i = 0; i < this.CONFIG.data.length; i++) {

                /* Store the columns. */
                if ($.inArray(this.CONFIG.data[i][this.CONFIG.cols_dimension], cols_dimension) < 0) {
                    cols_dimension.push(this.CONFIG.data[i][this.CONFIG.cols_dimension]);
                }

                /* Store the rows and the values. */
                if ($.inArray(this.CONFIG.data[i][this.CONFIG.row_code], codes_buffer) < 0) {
                    codes_buffer.push(this.CONFIG.data[i][this.CONFIG.row_code]);
                    var values = [];
                    for (var j = 0; j < this.CONFIG.data.length; j++) {
                        if (this.CONFIG.data[j][this.CONFIG.row_code] == this.CONFIG.data[i][this.CONFIG.row_code]) {
                            values.push(parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]) > -1 ? parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]).toFixed(2) : null);
                        }
                    }
                    rows_dimension.push({
                        values: values,
                        show_row_code: this.CONFIG.show_row_code,
                        code: this.CONFIG.data[i][this.CONFIG.row_code],
                        label: this.CONFIG.data[i][this.CONFIG.row_label]
                    });
                }

            }

            /* Load template. */
            var source = $(templates).filter('#faostat_ui_wide_tables_structure').html();
            var template = Handlebars.compile(source);
            var dynamic_data = {
                code_label: translate.code,
                label_label: translate.label,
                cols_dimension: cols_dimension,
                rows_dimension: rows_dimension,
                show_row_code: this.CONFIG.show_row_code
            };
            var html = template(dynamic_data);
            $('#' + this.CONFIG.placeholder_id).empty().html(html);

        } catch (e) {

            swal({
                title: translate.error,
                type: 'error',
                text: e,
                html: true
            });

        }

    };

    WIDE_TABLES.prototype.check_configuration = function() {

        /* Check whether data exists or not. */
        if (this.CONFIG.data == null)
            throw translate.data_is_null;

        /* Check row_code. */
        if (this.CONFIG.show_row_code && this.CONFIG.row_code == null)
            throw translate.row_code_is_null;

        /* Check row_label. */
        if (this.CONFIG.row_label == null)
            throw translate.row_label_is_null;

        /* Check cols_dimension. */
        if (this.CONFIG.cols_dimension == null)
            throw translate.cols_dimension_is_null;

        /* Check cols_dimension. */
        if (this.CONFIG.value_dimension == null)
            throw translate.value_dimension_is_null;

    };

    return WIDE_TABLES;

});