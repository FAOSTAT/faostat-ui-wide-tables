FAOSTAT UI Wide Tables
======================

This library displays data in the wide format, meaning that the indicators are displayed in the first row and the years (or another dimension) are shown as column headers:

|Name|2015|2014|2014|
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

|Name|Description|Example|
|----|-----------|-------|
|lang| Language used to display static labels and messages, ISO2 format|en|
|data| Data to be displayed, as discussed in the previous section| n.a.|
|placeholder_id|Page ID where the table will be rendered.|mytable|
|show_row_code|Flag to determin whether the code for the indicators in the first column must be displayed.|true|
|row_code|JSON property containing the codes for the indicators in the first column.|indicator_code|
|row_label|JSON property containing the labels for the indicators in the first column.|indicator_label|
|cols_dimension|JSON property containing the indicator to be displayed as column headers.|year|

Example
-------

The following example shows how to extract the data through the [WDS Table](https://github.com/FAOSTAT4/faostat-ui-commons/tree/development#wds-table) and display it though the wide tables library.

```javascript
/* Test WDS Tables. */
var sql =   "SELECT * " +
            "FROM UNFCCC_GAS " +
            "WHERE areacode = '10' " +
            "AND Year >= 1990 AND Year <= 2012 " +
            "AND tabletype = 'emissions' " +
            "ORDER BY UNFCCCCode, Year DESC";
Commons.wdstable(sql, function(json) {

  /* Initiate wide tables library. */
  var wt_1 = new WIDE_TABLES();

  /* Initiate the library. */
  wt_1.init({
    lang: _this.CONFIG.lang,
    data: json,
    placeholder_id: _this.CONFIG.placeholder_id,
    show_row_code: true,
    row_code: 'UNFCCCCode',
    row_label: 'GUNFItemNameE',
    cols_dimension: 'Year'
  });

}, 'http://localhost:8080/wds/rest');
```

The final result is very similar to the image below:

![Wide table example](https://github.com/FAOSTAT4/faostat-ui-wide-tables/blob/development/resources/images/wide_table.png)

Please Note
-----------

The tool displays the data as is, which means that the array must be already sorted according to the user needs.

Developed with 
--------------
![IntelliJ](http://www.jetbrains.com/idea/docs/logo_intellij_idea.png)
