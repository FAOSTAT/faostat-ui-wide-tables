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
