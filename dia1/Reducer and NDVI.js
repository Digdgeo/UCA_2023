// Load an image collection, filtered so it's not too much data.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate('2017-05-01', '2017-06-30')
  //.filter(ee.Filter.eq('WRS_PATH', 202))
  //.filter(ee.Filter.eq('WRS_ROW', 32));

// Compute the median in each band, each pixel.
// Band names are B1_median, B2_median, etc.

var ndvi = collection.map(function(image) {
  return image.select().addBands(image.normalizedDifference(['B5', 'B4']));
});

var median = ndvi.reduce(ee.Reducer.max());
var medianRGB = collection.reduce(ee.Reducer.median());

var vis = {min: 0, max: 1, palette: [
  '0000FF', 'F8ECE0', 'FCD163', '66A000', '207401',
  '056201', '004C00', '023B01', '012E01', '011301'
]};

// The output is an Image.  Add it to the map.
var vis_param = {min: 500, max: 4500, bands: ['B5_median', 'B4_median', 'B3_median'], 'vis':vis, gamma: 1.6};
Map.centerObject(geometry, 8);
Map.addLayer(median, vis);
Map.addLayer(medianRGB,vis_param, 'RGB');


//Export to Image (Drive, then)
Export.image.toDrive({
  image: median,
  description: 'NDVI_L8_2017_median',
  scale: 30,
  region: geometry,
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:25830',
  folder: 'CSIC'
  //maxPixels: 2000000000
});
