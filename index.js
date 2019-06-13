/* global fetch */

const {Deck} = require('@deck.gl/core')
const {PointCloudLayer} = require('@deck.gl/layers')
const {MapboxLayer} = require('@deck.gl/mapbox')
const {GUI} = require('dat-gui')
const mapboxgl = require('mapbox-gl')
const {csvParseRows} = require('d3-dsv')
const {scaleQuantile} = require('d3-scale')
const {color} = require('d3-color')
const {interpolateCool} = require('d3-scale-chromatic')
const MAPBOX_TOKEN = require('./mapbox-token')

const WHICH_DATA = 0;

const DATA = [
  {
    path: 'data/west-coast-lidar/west-coast-lidar-filtered.csv',
    center: [-122.4787, 37.8209],
    zoom: 15
  }
][WHICH_DATA]

const mapContainer = document.body.appendChild(document.createElement('div'))
mapContainer.style.width = '100vw'
mapContainer.style.height = '100vh'

const link = document.head.appendChild(document.createElement('link'))
link.rel = 'stylesheet'
link.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css'

mapboxgl.accessToken = MAPBOX_TOKEN
const map = new mapboxgl.Map({
  container: mapContainer,
  style: 'mapbox://styles/mapbox/light-v9',
  center: DATA.center,
  zoom: DATA.zoom
})
const deck = new Deck({gl: map.painter.context.gl})
map.on('load', () => {
  map.addLayer(new MapboxLayer({id: 'mapbox-layer', deck}))
})

fetch(DATA.path)
  .then(res => res.text())
  .then(res => {
    console.log('loaded!')
    const intensitiesSample = []
    const data = csvParseRows(res).slice(1).map(d => {
      const lat = Number(d[1])
      const lon = Number(d[0])
      const elevation = Number(d[2])
      const intensity = Number(d[3])
      if (Math.random() < 0.01) intensitiesSample.push(intensity)
      return {lat, lon, elevation, intensity}
    }).filter(d => d.elevation > 0)
    console.log('parsed!')

    const settings = {quantiles: 3, pointSize: 0.3}
    const gui = new GUI()
    gui.add(settings, 'quantiles', 2, 10).step(1).onChange(renderData)
    gui.add(settings, 'pointSize', 0.1, 1.5).onChange(renderData)

    renderData()
    function renderData () {
      const quantiles = new Array(settings.quantiles).fill().map((_, i) => i / (settings.quantiles - 1))
      const scale = scaleQuantile(intensitiesSample, quantiles)
      deck.setProps({
        layers: [
          new PointCloudLayer({
            id: 'point-cloud-layer',
            sizeUnits: 'meters',
            data: data,
            pickable: false,
            pointSize: settings.pointSize,
            getPosition: d => [d.lon, d.lat, d.elevation],
            getColor: d => {
              const {r, g, b} = color(interpolateCool(scale(d.intensity))).rgb()
              return [r, g, b, 0.8 * 255]
            },
            updateTriggers: {
              getColor: [settings.quantiles],
              pointSize: [settings.pointSize]
            }
          })
        ]
      })
    }
  })
