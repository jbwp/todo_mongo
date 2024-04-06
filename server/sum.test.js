// import sum from './sum.js'
const sum = require('./sum')

test.skip('sum', () => {
  expect(sum(1, 2)).toBe(3);
})