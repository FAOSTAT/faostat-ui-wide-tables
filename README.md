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
    label: 'Rain',
    code: 'R'
  },
  {
    year: 2014,
    value: 13,
    label: 'Rain',
    code: 'R'
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
|
