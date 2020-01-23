const multidata = require('../fixtures/schedule-multi-preorder-prices.result.json');

const multipreorder = require('../schedule-refactor');
const multidata1 = multipreorder('test1');


test('multi preorder', () => {
    expect(multidata1).toEqual(multidata);
  });


const expected2 = require('../fixtures/schedule-single-invalid-price.result.json');
const required2 = multipreorder('test2');
  

test('single invalid', () => {
    expect(expected2).toEqual(required2);
});

const expected3 = require('../fixtures/schedule.no.preorder.result.json');
const required3 = multipreorder('test3');
  

test('no preorder', () => {
    expect(expected3).toEqual(required3);
});
