const schedule = require('./schedule.json');
//const schedule = require('./schedule.pre.interval.json');

groupPrices(schedule);

function groupPrices(schedule) {
  let valid = [];
  let preOrder = [];
  let normal = [];
  let prices = []

  for (var i = 0; i < schedule.prices.length; i++) {
    if (!schedule.prices[i].endDate || schedule.prices[i].endDate >= schedule.preOrderDate) {
      valid.push(schedule.prices[i]);
    }
  }

  for (var i = 0; i < valid.length; i++) {
    if (valid[i].startDate <= schedule.startDate) {
      valid[i].preorder = true;
      preOrder.push(valid[i]);
    } else {
      valid[i].preorder = false;
      normal.push(valid[i]);
    }
  }

  // check to make sure dates don't already line up
  // check and make sure normal and preOrder are not empty
  (function() {
    preOrder[preOrder.length-1].endDate = schedule.startDate;
    preOrder[preOrder.length-1].endDateTime = schedule.startDateTime;

    let price = {
      startDate: preOrder[preOrder.length-1].endDate,
      startDateTime: preOrder[preOrder.length-1].endDateTime,
      endDate: normal[0].startDate,
      endDateTime: normal[0].startDateTime,
      currencyCode: preOrder[preOrder.length-1].currencyCode,
      pricetype: preOrder[preOrder.length-1].pricetype,
      priceCode: preOrder[preOrder.length-1].priceCode,
      price: preOrder[preOrder.length-1].price,
      preorder: false
    }

    normal.unshift(price);

  }());


  // move this to new function buildPriceArray
  for (var i = 0; i < preOrder.length; i++) {
    let price = {};
    if (preOrder[i].startDate <= schedule.preOrderDate) {
      price.startDate = schedule.preOrderDate;
      price.startDateTime = null;
    } else {
      price.startDate = preOrder[i].startDate;
      price.startDateTime = preOrder[i].startDateTime;
    }

    if (preOrder[i].endDate <= schedule.startDate) {
      price.endDate = preOrder[i].endDate;
      price.endDateTime = preOrder[i].endDateTime;
    } else {
      price.endDate = schedule.startDate;
      price.endDateTime = schedule.startDateTime;
    }

    price.currencyCode = preOrder[i].currencyCode;
    price.priceType = preOrder[i].priceType;
    price.priceCode = preOrder[i].priceCode;
    price.price = preOrder[i].price;
    price.preorder = true;

    prices.push(price);
  }

  prices.push(...normal);
  console.log(valid);
  console.log('\n\n');
  console.log(preOrder);
  console.log('\n\n');
  console.log(normal);
  console.log('\n\n');
  console.log(prices);
}

function isPriceActive(reference, candidate) {
  if (candidate.endDate && (candidate.endDate >= reference.endDate ||
    candidate.endDate >= reference.endDateTime)) {
    console.log(candidate);
    return true;
  }

  if (candidate.endDateTime && (candidate.endDateTime >= reference.endDate ||
    candidate.endDateTime >= reference.endDateTime)) {
    return true;
  }
  return false;

}

function normalizeSchedule(schedule) {
  let prices = [];
  if (schedule.preOrderDate) {
    let price = {
      startDate: schedule.preOrderDate,
      endDate: schedule.startDate,
      startDateTime: null,
      endDateTime: schedule.startDateTime,
      preorder: true
    }
    // else not preorder
    for (var i = 0; i < schedule.prices.length; i++) {
      if (isPriceActive(price, schedule.prices[i])) {
        price.currencyCode = schedule.prices[i].currencyCode;
        price.priceType = schedule.prices[i].priceType;
        price.priceCode = schedule.prices[i].priceCode;
        price.price = schedule.prices[i].price;
        prices.push(price);
      }
    }
    return prices;
  }
}