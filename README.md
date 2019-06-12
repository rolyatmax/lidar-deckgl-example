# lidar-deckgl-example

Just a quick example using [USGS LiDAR data](https://coast.noaa.gov/dataviewer/#/lidar/search/-13634567.69111097,4552319.113181287,-13633773.164031802,4555144.969216241) with DeckGL.

![lidar-deckgl-example](/screenshots/3.png?raw=true "lidar-deckgl-example")

### You'll need to do a few things to get this working.

1. Unzip `data/west-coast-lidar/west-coast-lidar-filtered.csv.gz` (and save the unzipped file as `data/west-coast-lidar/west-coast-lidar-filtered.csv`)
2. Create a `mapbox-token.js` file in the root of this repo whose contents is: `module.exports = '<YOUR MAPBOX TOKEN HERE>'`. (You can get a free mapbox token at [account.mapbox.com](https://account.mapbox.com).)
3. `npm install`
4. `npm start`

### Resources:

* [NOAA's Data Access Viewer](https://coast.noaa.gov/dataviewer/#/lidar/search/-13634567.69111097,4552319.113181287,-13633773.164031802,4555144.969216241) - this demo uses the `2016 USGS Lidar: West Coast El Nino (WA, OR, CA)` dataset.
* [Coloring LIDAR](https://blog.mapbox.com/coloring-lidar-4522ca5a7186) - by [Allan Walker](https://www.mapbox.com/about/team/allan-walker/)
