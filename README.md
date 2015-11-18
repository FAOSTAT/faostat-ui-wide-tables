[![Stories in Progress](https://badge.waffle.io/faostat4/faostat-ui-wide-tables.svg?label=in%20Progress&title=In%20Progress)](http://waffle.io/faostat4/faostat-ui-wide-tables)

FAOSTAT UI Wide Tables
======================

This library displays data in the wide format, meaning that the indicators are displayed in the first row and the years (or another dimension) are shown as column headers:

|Indicator|2015|2014|2014|
|----|----|----|----|
|**Rain**|12|13|18|
|**Temperature**|8|7|6|

Data Format
-----------

The tool need a JSON array of objects containing the data to be displayed.

```javascript
var data = [
  {
    year: 2015,
    value: 12,
    indicator_label: 'Rain',
    indicator_code: 'R'
  },
  {
    year: 2014,
    value: 13,
    indicator_label: 'Rain',
    indicator_code: 'R'
  }
  ...
]
```

Parameters
----------

The tool requires a JSON configuration object when it is initialized:

```javascript
var wt_1 = new WIDE_TABLES();
wt_1.init({
  placeholder_id: 'my_table',
  ...
});
```

The next table shows all the parameters required to render a wide table.

|Name|Description|Example|
|----|-----------|-------|
|lang| Language used to display static labels and messages, ISO2 format|en|
|data| Data to be displayed, as discussed in the previous section| n.a.|
|placeholder_id|Page ID where the table will be rendered.|mytable|
|show_row_code|Flag to determin whether the code for the indicators in the first column must be displayed.|true|
|row_code|JSON property containing the codes for the indicators in the first column.|indicator_code|
|row_label|JSON property containing the labels for the indicators in the first column.|indicator_label|
|cols_dimension|JSON property containing the indicator to be displayed as column headers.|year|
|value_dimension|JSON property containing the value to be displayed in the table body.|value|
|blacklist|Array of codes that will not be displayed in the table.|['1', '5', '7']|
|color_values|Flag to determin whether the numbers in the tables will be colored according to their value: green for values greater than zero and red for the ones smaller than zero.|true|
|bottom_row_codes|Array of values to be displayed in the bottom row(s) with a different style.|['27']|
|sort_by|Sorte the rows by the specified dimension, 'label' by default.|'code' or 'label'.|

Example
-------

The following example shows how to extract the data through the [WDS Table](https://github.com/FAOSTAT4/faostat-ui-commons/tree/development#wds-table) and display it though the wide tables library.

```javascript
/* SQL query. */
var sql =   "SELECT * " +
            "FROM UNFCCC_GAS " +
            "WHERE areacode = '10' " +
            "AND Year >= 1990 AND Year <= 2012 " +
            "AND tabletype = 'emissions' " +
            "ORDER BY UNFCCCCode, Year DESC";

/* Fetch data and define callback function. */
Commons.wdstable(sql, function(json) {

  /* Initiate wide tables library. */
  var wt_1 = new WIDE_TABLES();

  /* Initiate the library. */
  wt_1.init({
    lang: 'en',
    data: json,
    placeholder_id: 'my_table',
    show_row_code: true,
    row_code: 'UNFCCCCode',
    row_label: 'GUNFItemNameE',
    cols_dimension: 'Year',
    value_dimension: 'GUNFValue'
  });

}, 'http://localhost:8080/wds/rest');
```

The final result is very similar to the image below:

![Wide table example](https://github.com/FAOSTAT4/faostat-ui-wide-tables/blob/development/resources/images/wide_table.png)

Bottom Row
----------

Values in the last row of the tables are emphasized in bold, with a different background and font color. It is possible to specify which codes must be highlighted (e.g. the totals) through the ```bottom_row_codes``` parameter.

```javascript
var config = {
  ...
  bottom_row_codes: ['1058']
  ...
}
```

The final result is very similar to the image below:

![Wide table example](https://github.com/FAOSTAT4/faostat-ui-wide-tables/blob/development/resources/images/wide_table_totals.png)

Color Values
------------

It is possible to display the values in the table in different colors, according to the numeric value: <span style='color: #009B77'>green</span> for values greater than zero, and <span style='color: #9B2335'>red</span> for values smaller than zero. Zero will be displayed with the standard color.

```javascript
var config = {
  ...
  color_values: true
  ...
}
```

The final result is very similar to the image below:

![Wide table example](https://github.com/FAOSTAT4/faostat-ui-wide-tables/blob/development/resources/images/wide_table_colors.png)

Export Table
------------

The export function creates a CSV file and needs two parameters:

|Name|Description|Example|
|----|-----------|-------|
|description|A string that will be added at the bottom of the file.|"This table has been automatically generated."|
|file_name|Name of the output file, without extension.|my_file|

```javascript
/* Initiate wide tables library. */
var wt_1 = new WIDE_TABLES();

/* Initiate the library. */
wt_1.init({
  lang: 'en',
  data: json,
  placeholder_id: 'my_table',
  show_row_code: true,
  row_code: 'UNFCCCCode',
  row_label: 'GUNFItemNameE',
  cols_dimension: 'Year',
  value_dimension: 'GUNFValue'
});

/* Export the table. */
wt_1.export_table('This table is very nice!', 'my_table');
```

Developed with 
--------------
![IntelliJ](http://www.jetbrains.com/idea/docs/logo_intellij_idea.png)
