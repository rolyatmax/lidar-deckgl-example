/* global fetch */

const {Deck, OrbitView, COORDINATE_SYSTEM} = require('@deck.gl/core')
const {PointCloudLayer} = require('@deck.gl/layers')
const {GUI} = require('dat-gui')
const Alea = require('alea')
const {median} = require('d3-array')
const {scaleQuantile} = require('d3-scale')
const {color} = require('d3-color')
const {interpolateCool} = require('d3-scale-chromatic')
const MAPBOX_TOKEN = require('./mapbox-token')

const WHICH_DATA = 0;
const rand = new Alea(0)

const DATA = [
  {
    path: 'data/semantic3d/marketplacefeldkirch_station7_intensity_rgb-filtered.csv'
  }
][WHICH_DATA]

fetch(DATA.path)
  .then(res => res.text())
  .then(res => {
    console.log('loaded!')
    const sample = []
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
      const datum = {x, y, z, intensity, r, g, b}
      if (rand() < 0.01) sample.push(datum)
      return datum
    }).filter(Boolean)
    const centerX = median(sample.map(d => d.x))
    const centerY = median(sample.map(d => d.y))
    const centerZ = median(sample.map(d => d.z))

    console.log('parsed!', data.slice(0, 20))

    const deck = new Deck({
      parameters: {
        blend: false
      },
      controller: true,
      views: new OrbitView(),
      initialViewState: {
        target: [centerX, centerY, centerZ],
        rotationX: 0,
        rotationOrbit: 0,
        // orbitAxis: 'Y',
        fov: 50,
        minZoom: 0,
        maxZoom: 10,
        zoom: 1
      }
    })


    const settings = {quantiles: 5, pointSize: 0.2}
    const gui = new GUI()
    gui.add(settings, 'quantiles', 2, 10).step(1).onChange(renderData)
    gui.add(settings, 'pointSize', 0.1, 5).onChange(renderData)

    renderData()
    function renderData () {
      const quantiles = new Array(settings.quantiles).fill().map((_, i) => i / (settings.quantiles - 1))
      const scale = scaleQuantile(sample.map(d => d.intensity), quantiles)
      deck.setProps({
        layers: [
          new PointCloudLayer({
            id: 'point-cloud-layer',
            coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
            data: data,
            pickable: false,
            pointSize: settings.pointSize,
            getPosition: ({x, y, z}) => [x, y, z],
            getColor: ({intensity}) => {
              const {r, g, b} = color(interpolateCool(scale(intensity))).rgb()
              return [r, g, b, 0.8 * 255]

              // const a = 255 // scale(intensity)
              // return [r, g, b, a]
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
