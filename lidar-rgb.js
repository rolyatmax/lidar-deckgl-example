/* global fetch */

const {Deck, COORDINATE_SYSTEM} = require('@deck.gl/core')
const {PointCloudLayer} = require('@deck.gl/layers')
const {GUI} = require('dat-gui')
const {mean} = require('d3-array')
const {scaleQuantile} = require('d3-scale')
const MAPBOX_TOKEN = require('./mapbox-token')

const WHICH_DATA = 0;

const DATA = [
  {
    path: 'data/semantic3d/marketplacefeldkirch_station7_intensity_rgb-filtered.csv'
  }
][WHICH_DATA]

const deck = new Deck({
  controller: true
})

fetch(DATA.path)
  .then(res => res.text())
  .then(res => {
    console.log('loaded!')
    const intensitiesSample = []
    const data = res.split('\n').map(d => {
      if (!d) return null
      d = d.split(' ')
      const x = Number(d[0])
      const y = Number(d[1])
      const z = Number(d[2])
      const intensity = Number(d[3])
      const r = Number(d[4])
      const g = Number(d[5])
      const b = Number(d[6])
      if (Math.random() < 0.01) intensitiesSample.push(intensity)
      return {x, y, z, intensity, r, g, b}
    }).filter(Boolean)
    const centerX = mean(data.map(d => d.x))
    const centerY = mean(data.map(d => d.y))

    console.log('parsed!', data.slice(0, 20))

    const settings = {quantiles: 5, pointSize: 3}
    const gui = new GUI()
    gui.add(settings, 'quantiles', 2, 10).step(1).onChange(renderData)
    gui.add(settings, 'pointSize', 1, 50).onChange(renderData)

    renderData()
    function renderData () {
      const quantiles = new Array(settings.quantiles).fill().map((_, i) => i / (settings.quantiles - 1))
      const scale = scaleQuantile(intensitiesSample, quantiles)
      deck.setProps({
        layers: [
          new PointCloudLayer({
            id: 'point-cloud-layer',
            coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
            coordinateOrigin: [centerX, centerY],
            data: data,
            pickable: false,
            pointSize: settings.pointSize,
            getPosition: ({x, y, z}) => [x, y, z],
            getColor: ({r, g, b, intensity}) => {
              const a = 255 // scale(intensity)
              return [r, g, b, a]
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
