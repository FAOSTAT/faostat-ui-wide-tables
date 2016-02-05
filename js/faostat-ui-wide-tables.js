define(['jquery',
        'underscore',
        'handlebars',
        'text!faostat_ui_wide_tables/html/templates.html',
        'i18n!faostat_ui_wide_tables/nls/translate',
        'FAOSTAT_UI_COMMONS',
        'loglevel',
        'bootstrap',
        'FileSaver',
        'sweetAlert',
        'amplify'], function ($, _, Handlebars, templates, translate, Commons, log) {

    'use strict';

    function WIDE_TABLES() {

        this.CONFIG = {

            lang                            :   'en',
            data                            :   null,
            lang_faostat                    :   'E',

            row_code                        :   null,
            row_label                       :   null,
            blacklist                       :   [],
            color_values                    :   false,
            show_row_code                   :   true,
            cols_dimension                  :   null,
            value_dimension                 :   null,
            bottom_row_codes                :   null,
            sort_by                         :   'label',

            prefix                          :   'faostat_ui_wide_tables_',
            placeholder_id                  :   'faostat_ui_wide_tables',

            template_cols_dimension         :   [],
            template_rows_dimension         :   [],
            template_bottom_rows_dimension  :   [],
            thousand_separator              :   ','

        };

    }

    WIDE_TABLES.prototype.init = function(config) {

       // log.info("WIDE_TABLES.init;");

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* This... */
        var _this = this;

        /* Check configuration. */
        try {

            /* Check configuration. */
            this.check_configuration();

            /* Fix the language, if needed. */
            this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

            /* Store FAOSTAT language. */
            this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

            /* Initiate variables. */
            this.CONFIG.template_cols_dimension = [];
            this.CONFIG.template_rows_dimension = [];
            this.CONFIG.template_bottom_rows_dimension = [];
            var codes_buffer = [];
            var bottom_codes_buffer = [];

            /* Row counter. */
            var row_index = 1;

            /* Iterate over the values. */
            for (var i = 0; i < this.CONFIG.data.length; i++) {

                /* Store the columns. */
                if ($.inArray(this.CONFIG.data[i][this.CONFIG.cols_dimension], this.CONFIG.template_cols_dimension) < 0) {
                    this.CONFIG.template_cols_dimension.push(this.CONFIG.data[i][this.CONFIG.cols_dimension]);
                }

                /* Check whether the code is in the blacklist. */
                if ($.inArray(this.CONFIG.data[i][this.CONFIG.row_code], this.CONFIG.blacklist) < 0) {

                    /* Bottom row has a different template. */
                    if ($.inArray(this.CONFIG.data[i][this.CONFIG.row_code], this.CONFIG.bottom_row_codes) < 0) {

                        /* Store the rows and the values. */
                        if ($.inArray(this.CONFIG.data[i][this.CONFIG.row_code], codes_buffer) < 0) {
                            codes_buffer.push(this.CONFIG.data[i][this.CONFIG.row_code]);
                            var values = [];
                            for (var j = 0; j < this.CONFIG.data.length; j++) {
                                if (this.CONFIG.data[j][this.CONFIG.row_code] == this.CONFIG.data[i][this.CONFIG.row_code]) {
                                    log.info(this.CONFIG.value_dimension, this.CONFIG.data[j]);
                                    log.info(this.CONFIG.data[j].GUNFItemNameE, this.CONFIG.data[j][this.CONFIG.value_dimension]);
                                    //var value = parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]) > -1 ? parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]).toFixed(2) : null;
                                    var value = isNaN(this.CONFIG.data[j][this.CONFIG.value_dimension])? null: parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]).toFixed(2);
                                    log.info(value, parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]));
                                    if (value == null) {
                                        value = '&nbsp;';
                                    }else{
                                        value = this.formatValue(value);
                                    }
                                    values.push(value);
                                }
                            }
                            this.CONFIG.template_rows_dimension.push({
                                values: values,
                                show_row_code: this.CONFIG.show_row_code,
                                code: this.CONFIG.data[i][this.CONFIG.row_code],
                                label: this.CONFIG.data[i][this.CONFIG.row_label],
                                row_index: row_index++
                            });
                        }

                    }

                    /* Collect values for the bottom row. */
                    else {

                        /* Store the rows and the values. */
                        if ($.inArray(this.CONFIG.data[i][this.CONFIG.row_code], bottom_codes_buffer) < 0) {
                            bottom_codes_buffer.push(this.CONFIG.data[i][this.CONFIG.row_code]);
                            var bottom_values = [];
                            for (j = 0; j < this.CONFIG.data.length; j++) {
                                if (this.CONFIG.data[j][this.CONFIG.row_code] == this.CONFIG.data[i][this.CONFIG.row_code])  {
                                    var bottom_value = isNaN(this.CONFIG.data[j][this.CONFIG.value_dimension])? null: parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]).toFixed(2);
                                    //var bottom_value = parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]) > -1 ? parseFloat(this.CONFIG.data[j][this.CONFIG.value_dimension]).toFixed(2) : null;
                                    if (bottom_value == null) {
                                        bottom_value = '&nbsp;';
                                    }else {
                                        bottom_value = this.formatValue(bottom_value);
                                    }
                                    bottom_values.push(bottom_value);
                                }
                            }
                            this.CONFIG.template_bottom_rows_dimension.push({
                                values: bottom_values,
                                show_row_code: this.CONFIG.show_row_code,
                                bottom_code: this.CONFIG.data[i][this.CONFIG.row_code],
                                label: this.CONFIG.data[i][this.CONFIG.row_label],
                                row_index: row_index++
                            });
                        }

                    }

                }

            }

            /* Register function to colour items based on their colour. */
            Handlebars.registerHelper('get_class_name', function (value) {
                return _this.CONFIG.color_values ? (value > 0 ? 'green_value' : 'red_value') : '';
            });

            /* Sort rows by label. */
            this.CONFIG.template_rows_dimension = _.sortBy(this.CONFIG.template_rows_dimension, this.CONFIG.sort_by);

            /* Load template. */
            var source = $(templates).filter('#faostat_ui_wide_tables_structure').html();
            var template = Handlebars.compile(source);
            var dynamic_data = {
                code_label: translate.code,
                label_label: translate.label,
                cols_dimension: this.CONFIG.template_cols_dimension,
                rows_dimension: this.CONFIG.template_rows_dimension,
                bottom_rows_dimension: this.CONFIG.template_bottom_rows_dimension,
                show_row_code: this.CONFIG.show_row_code,
                scroll_id:this.CONFIG.placeholder_id + '_scroll',
                left_table_id: this.CONFIG.prefix + '_left',
                right_table_id: this.CONFIG.prefix + '_right'
            };


            //log.info(dynamic_data);

            if (this.CONFIG.data[0] !== undefined) {
               if ( this.CONFIG.data[0].DomainCode.toUpperCase() === 'GM') {
                   log.info("--------------------");
                   log.info( this.CONFIG.data);
                   log.info(dynamic_data);
               }

            }

                //log.info("TABLE data;", this.CONFIG.data[area_code]);



            var html = template(dynamic_data);
            $('#' + this.CONFIG.placeholder_id).empty().html(html);

            /* Synchronize row highlight on multiple tables. */
            //$('#' + this.CONFIG.placeholder_id + ' tr').mouseenter(function() {
            //    var row_index = $(this).data('rowindex');
            //    if (row_index != null) {
            //        try {
            //            $('#' + _this.CONFIG.prefix + '_right' + ' tbody tr:nth-child(' + row_index + ')').addClass('linked-row');
            //            $('#' + _this.CONFIG.prefix + '_left' + ' tbody tr:nth-child(' + row_index + ')').addClass('linked-row');
            //        } catch (e) {
            //
            //        }
            //    }
            //}).mouseleave(function() {
            //    var row_index = $(this).data('rowindex');
            //    if (row_index != null) {
            //        try {
            //            $('#' + _this.CONFIG.prefix + '_right' + ' tbody tr:nth-child(' + row_index + ')').removeClass('linked-row');
            //            $('#' + _this.CONFIG.prefix + '_left' + ' tbody tr:nth-child(' + row_index + ')').removeClass('linked-row');
            //        } catch (e) {
            //
            //        }
            //    }
            //});

        } catch (e) {

            swal({
                title: translate.error,
                type: 'error',
                text: e,
                html: true
            });

        }

    };

    WIDE_TABLES.prototype.export_table = function(description, file_name, exportObj) {

        // override if there are export configurations
        this.CONFIG = $.extend(true, {}, this.CONFIG, exportObj || {});

        /* Set file name. */
        file_name = file_name != null ? file_name + '.csv' : 'FAOSTAT.csv';

        /* Initiate the CSV content. */
        var csv = '';

        /* Add code header. */
        if (this.CONFIG.show_row_code)
            csv += '\"' + translate.code + '\",';

        /* Add label header. */
        csv += '\"' + translate.label + '\",';

        /* Add column headers. */
        for (var i = 0 ; i < this.CONFIG.template_cols_dimension.length ; i++) {
            csv += '\"' + this.CONFIG.template_cols_dimension[i] + '\"';
            if (i < this.CONFIG.template_cols_dimension.length - 1)
                csv += ','
        }
        csv += '\n';

        /* Iterate over contents. */
        for (i = 0 ; i < this.CONFIG.template_rows_dimension.length ; i++) {

            /* Current row. */
            var row = this.CONFIG.template_rows_dimension[i];

            /* Add code. */
            if (this.CONFIG.show_row_code)
                csv += '\"' + row.code + '\",';

            /* Add label. */
            csv += '\"' + row.label + '\", ';

            /* Add values. */
            for (var j = 0 ; j < row.values.length ; j++) {
                csv += row.values[j] != '&nbsp;' ? '\"' + row.values[j] + '\"' : '';
                if (j < row.values.length - 1)
                    csv += ',';
            }

            /* Add new line. */
            csv += '\n';

        }

        /* Iterate over bottom row. */
        for (i = 0 ; i < this.CONFIG.template_bottom_rows_dimension.length ; i++) {

            /* Current row. */
            row = this.CONFIG.template_bottom_rows_dimension[i];

            /* Add code. */
            if (this.CONFIG.show_row_code)
                csv += '\"' + row.code + '\",';

            /* Add label. */
            csv += '\"' + row.label + '\", ';

            /* Add values. */
            for (j = 0 ; j < row.values.length ; j++) {
                csv += row.values[j] != '&nbsp;' ? '\"' + row.values[j] + '\"' : '';
                if (j < row.values.length - 1)
                    csv += ',';
            }

            /* Add new line. */
            csv += '\n';

        }

        /* Add source and date. */
        csv += '\n\n\n';
        csv += translate.country + ': '  + this.CONFIG.area_name + '\n';
        csv += translate.description + ': ' + this.sanitizeString(this.CONFIG.description) + '\n';
        csv += translate.source + ': ' + this.CONFIG.source + '\n';
        csv += translate.date + ': ' + (new Date()).toDateString() + '\n';

        var blob = new Blob([csv], {type: "data:application/csv;charset=utf-8;"});

        // override filename
        file_name = this.sanitizeStringFilename(this.CONFIG.description) +".csv";

        saveAs(blob, file_name);

        /* Export the CSV. */
        /*var a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,\n' + encodeURIComponent(csv);
        a.target = '_blank';
        a.download = file_name;
        document.body.appendChild(a);
        a.click();*/

    };

    // dirty sinitaze of the string
    WIDE_TABLES.prototype.sanitizeString = function(text) {
        if (text) {
            return text.replace('<sub>', '').replace('</sub>', '');
        }
        else {
            return text;
        }
    };

    WIDE_TABLES.prototype.sanitizeStringFilename = function(text) {
        if (text) {
            return text.replace('<sub>', '').replace('</sub>', '').replace('[%]', '');
        }
        else {
            return text;
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

    WIDE_TABLES.prototype.formatValue = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.CONFIG.thousand_separator);
    };

    return WIDE_TABLES;

});