
var str1 = '2019-10-15T03:16:30.673Z';
var str2 = '2015-05-12T03:59:59';

var date = new Date();
var datetimegmt = str1.endsWith('Z') ? new Date(str1) : new Date(str1 + 'Z');
var datetime = str2.endsWith('Z') ? new Date(str2) : new Date(str2 + 'Z');

var datestr = datetime.toISOString();
console.log(datestr.slice(0,-1));

console.log(date);
console.log(datetimegmt);
console.log(datetime);

var nextDate = new Date(datetime.getTime() + (1000 * 1));
console.log(nextDate);


var o = {};
var s = 'test';

o[s] = 'value';
