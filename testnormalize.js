const normalize = require('./normalize-prices')
const schedule = require('./fixtures/schedule-multi-preorder-prices.json');

normalize(schedule);
console.log(JSON.stringify(schedule));


