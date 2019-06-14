const argv = require('minimist')(process.argv.slice(2))
const Alea = require('alea')
const readline = require('readline')

const { rate, seed } = argv
if (argv.help || argv.h || !argv.rate || argv.rate > 1) {
  console.log(`
  Usage: cat data.csv | node sample-rows.js --rate 0.1 --seed 123
  
  rate - a number from 0 -> 1 that indicates sample rate
  seed (optional) - a number to seed the random number generator for deterministic results
`
  )
  process.exit()
}

const rl = readline.createInterface({ input: process.stdin })
const rand = new Alea(seed || Math.random())

let isFirstLine = true
rl.on('line', (input) => {
  // always output the first line
  if (isFirstLine) {
    process.stdout.write(input)
    process.stdout.write('\n')
    isFirstLine = false
    return
  }

  if (rand() < rate) {
    process.stdout.write(input)
    process.stdout.write('\n')
  }
})
