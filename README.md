# lidar-deckgl-example

Just a quick example using LiDAR data with DeckGL. You'll need to do a few things to get this working.

![lidar-deckgl-example](/screenshots/Screen%20Shot%202019-06-12%20at%2011.05.37%20AM.png?raw=true "lidar-deckgl-example")

1. Unzip `data/west-coast-lidar/west-coast-lidar-filtered.csv.gz` (and save the unzipped file as `data/west-coast-lidar/west-coast-lidar-filtered.csv`)
2. Create a `mapbox-token.js` file in the root of this repo whose contents is: `module.exports = '<YOUR MAPBOX TOKEN HERE>'`. (You can get a free mapbox token at [account.mapbox.com](https://account.mapbox.com).)
3. `npm install`
4. `npm start`
