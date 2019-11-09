//const schedule = require('./schedule.json');
const schedule = require('./schedule.timedate.json');

groupPrices(schedule);

/**
 * 
 * Scheduling and pricing are independant in GRPS.  For functionalities that require pricing
 * this can result in a scenario where a pricing interval is earlier than the schedule start time.
 * For DDEX offers this is normalized but in iTunes this passed through in the XML.
 * 
 * SMEJ cannot handle this logic and needs us to normalize the price intervals for iTunes as well
 *  
 */

/**
 * 
 * @param {*} schedule
 * 
 */
function groupPrices(schedule) {
  let valid = [];
  let preOrder = [];
  let normal = [];
  let prices = []

  /**
   * check all prices and make sure they fall within the schedule dates
   */
  for (var i = 0; i < schedule.prices.length; i++) {
    let absEndDate = schedule.prices[i].endDate ? schedule.prices[i].endDate : schedule.prices[i].endDateTime;
    let absStartDate = schedule.prices[i].startDate ? schedule.prices[i].startDate : schedule.prices[i].startDateTime;
    
    if (!absEndDate || absEndDate >= schedule.preOrderDate) {
      schedule.prices[i].absEndDate = absEndDate;
      schedule.prices[i].absStartDate = absStartDate;
      valid.push(schedule.prices[i]);
    }
  }

  /**
   * group prices into preorder and normal groups
   */
  for (var i = 0; i < valid.length; i++) {
    if (valid[i].absStartDate <= schedule.startDate) {
      valid[i].preorder = true;
      preOrder.push(valid[i]);
    } else {
      valid[i].preorder = false;
      normal.push(valid[i]);
    }
  }

  // subtract 1 second from startDatetime
  // check to make sure dates don't already line up
  // check and make sure normal and preOrder are not empty
  /**
   * insert a non preorder price if dates don't line up
   */
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
    if (preOrder[i].absStartDate <= schedule.preOrderDate) {
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

