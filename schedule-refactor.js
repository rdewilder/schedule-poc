//const schedule = require('./schedule.json');
const schedule = require('./fixtures/schedule-multi-preorder-prices.json');
//const schedule = require('./fixtures/schedule.timedate.json');
const samples = new Map();
samples.set('test1', require('./fixtures/schedule-multi-preorder-prices.json'));
samples.set('test2', require('./fixtures/schedule-single-invalid-price.json'));
samples.set('test3', require('./fixtures/schedule.no.preorder.json'));



/**
 * Step 1: Find valid prices
 * A price is valid if the enddate is greater than schedule.preorder or startDate / time
 * 
 * Step 2: Confirm first valid price startDate / time is equal to preOrderDate if exists or startDatetime
 *  
 * Step 3: Find preOrder and normal prices
 * A price is considered preOrder if it is valid and the start date is < schdule startDate / time
 * 
 * Step 4: align preOrder prices
 *   - check if preorder ends in middle of a price interval.
 *   - prepend new normal date where start = last preorder end and end = first normal start
 *  
 * 
 */

function getValidPrices(schedule) {
  let prices = [];

  let scheduleStart = (function () {
    if(schedule.preOrderDate) return schedule.preOrderDate;
    return schedule.startDate ? schedule.startDate : schedule.startDateTime;
  }());

  for (var i = 0; i < schedule.prices.length; i++) {
    schedule.prices[i].absStartDate = schedule.prices[i].startDate ? schedule.prices[i].startDate : schedule.prices[i].startDateTime;
    schedule.prices[i].absEndDate = schedule.prices[i].endDate ? schedule.prices[i].endDate : schedule.prices[i].endDateTime;
    
    /**
     * If no absEndDate or absEndate >= scheduleStart it is valid
     * 
     */
    if (!schedule.prices[i].absEndDate || schedule.prices[i].absEndDate >= scheduleStart) {
      if(schedule.prices[i].absStartDate < scheduleStart) {
        if(schedule.preOrderDate) {
          schedule.prices[i].startDate = schedule.preOrderDate;
          schedule.prices[i].startDateTime = null;
          schedule.prices[i].absStartDate = schedule.preOrderDate;
        }
        else {
          schedule.prices[i].startDate = schedule.startDate;
          schedule.prices[i].startDateTime = schedule.startDateTime;
          schedule.prices[i].absStartDate = schedule.startDate ? schedule.startDate : schedule.startDateTime;
        }
      }      
      prices.push(schedule.prices[i]);
    }
  }
  return prices;
}


function groupPrices(schedule) {
  let preOrder = [];
  let normal = [];

  let scheduleStart = schedule.startDate ? schedule.startDate : schedule.startDateTime;

  for (var i = 0; i < schedule.prices.length; i++) {
    if (schedule.prices[i].absStartDate < scheduleStart) {
      schedule.prices[i].preorder = true;
      preOrder.push(schedule.prices[i]);
    } else {
      schedule.prices[i].preorder = false;
      normal.push(schedule.prices[i]);
    }
  }
  return {preorder: preOrder, normal: normal};
}

function alignDates(preorder, normal, schedule) {
  if( preorder.length == 0 ) return normal;

  let prices = [];

  if( preorder[preorder.length-1].endDate) {
    if(preorder[preorder.length-1].endDate != schedule.startDate) {
      preorder[preorder.length-1].endDate = schedule.startDate;
      let price = {...preorder[preorder.length-1]};
      price.absStartDate = null;
      price.absEndDate = null;
      price.startDate = preorder[preorder.length-1].endDate;
      price.endDate = normal[0].startDate;
      price.preorder = false;
      //console.log(`align dates 2: ${JSON.stringify(price,null,4)}`);
      normal.unshift(price);
    }
  }

  if( preorder[preorder.length-1].endDateTime) {
    if(preorder[preorder.length-1].endDateTime != schedule.startDateTime) {
      // look at date Aritchmetic
      preorder[preorder.length-1].endDateTime = schedule.startDateTime;
      let price = {...preorder[preorder.length-1]};
      price.startDateTime = preorder[preorder.length-1].endDateTime;
      price.endDateTime = normal[0].startDateTime;
      price.preorder = false;
      price.rob = 'piss';
      normal.unshift(price);
    }
  }

  //console.log(`normal: ${JSON.stringify(normal,null,4)}`);
  prices.push(...preorder);
  prices.push(...normal);
  //console.log(`prices: ${JSON.stringify(prices,null,4)}`);

  return prices;

}

function normalize(test) {
  var schedule = samples.get(test);
  schedule.prices = getValidPrices(schedule);
  let {preorder, normal} = groupPrices(schedule);
  schedule.prices = alignDates(preorder, normal, schedule);
  return schedule;
}

module.exports = normalize;


