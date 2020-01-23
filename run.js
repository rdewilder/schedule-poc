const normal = require('./schedule-refactor');

const schedule = normal('test1');

console.log(`schedule: ${JSON.stringify(schedule,null,4)}`);
