const group = require('./fixtures/161436744.json');

backfillPricingInfo(group);

async function backfillPricingInfo(group) {  
  group.group.product.scheduleSets = normalizeDealIds(group.group.product.scheduleSets);
  console.log(JSON.stringify(group.group.product.scheduleSets,null,4));
}

function normalizeDealIds(sets) {
  const keys = Object.keys(sets);
  let arr = [];
  for (var i = 0; i < keys.length; i++) {
      let deal = {
          dealId: keys[i],
          dealTerms: sets[keys[i]]
      }
      createMockPricing(deal);
      arr.push(deal);
  } 
  return arr;
}

function createMockPricing(deal) {
  for (var i = 0; i < deal.dealTerms.length; i++) {
    if( !deal.dealTerms[i].prices || !deal.dealTerms[i].prices.length ) {      
      deal.dealTerms[i].prices = [{
        startDate: deal.dealTerms[i].startDate,
        endDate: deal.dealTerms[i].endDate,
        startDateTime: deal.dealTerms[i].startDateTime,
        endDateTime: deal.dealTerms[i].endDateTime
      }]
    }
  }
}
