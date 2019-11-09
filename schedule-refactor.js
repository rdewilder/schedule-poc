//const schedule = require('./schedule.json');
//const schedule = require('./schedule.no.preorder.json');
const schedule = require('./schedule.timedate.json');


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


schedule.prices = getValidPrices(schedule);
let {preorder, normal} = groupPrices(schedule);
let prices = alignDates(preorder, normal, schedule);
console.log(prices);

function getValidPrices(schedule) {
  let prices = [];

  let scheduleStart = (function () {
    if(schedule.preOrderDate) return schedule.preOrderDate;
    return schedule.startDate ? schedule.startDate : schedule.startDateTime;
  }());

  console.log(scheduleStart);

  for (var i = 0; i < schedule.prices.length; i++) {
    schedule.prices[i].absStartDate = schedule.prices[i].startDate ? schedule.prices[i].startDate : schedule.prices[i].startDateTime;
    schedule.prices[i].absEndDate = schedule.prices[i].endDate ? schedule.prices[i].endDate : schedule.prices[i].endDateTime;
    
    if (!schedule.prices[i].absEndDate || schedule.prices[i].absEndDate >= scheduleStart) {
      if(schedule.prices[i].absStartDate < scheduleStart) {
        console.log('in here');
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
      price.startDate = preorder[preorder.length-1].endDate;
      price.endDate = normal[0].startDate;
      price.preorder = false;
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

  prices.push(...preorder);
  prices.push(...normal);

  return prices;

}


