const DENOMINATION = {
  'ONE HUNDRED': 100,
  'TWENTY': 20,
  'TEN': 10,
  'FIVE': 5,
  'ONE': 1,
  'QUARTER': 0.25,
  'DIME': 0.1,
  'NICKEL': 0.05,
  'PENNY': 0.01,
}

const STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS'
}

// HELPER => sum up the total in a cash-in-drawer 2D array
// Contains EVERY denomination name and the amount available for that denomination
// e.g. ['PENNY', 1.01]['ONE HUNDRED', 0][etc.]
function cashTotal(cid) {
  var total = 0;
  cid.forEach((value) => {
    // second item in value array is the amount (in USD)
    total += value[1];
  });
  return total;
}

// Execute
function checkCashRegister(price, cash, cid) {
  // initialize the change and status objects
  let change = [];
  let status = STATUS.OPEN;

  // how much change is due
  const changeNeeded = cash - price;

  // calculat change composition and status
  var remChangeNeeded = changeNeeded;
  if (cashTotal(cid) > changeNeeded) {
    // IF - there is enough money in the drawer to give change
    Object.keys(DENOMINATION).forEach((denom) => {
      // filter array down to the one relevant for current denomination
      const availableInDenom = cid.filter(function(denomBalance) { return denomBalance[0] === denom; })[0][1];
      // calculate max amount we could need from current denomination
      const neededInDenom = Math.floor(remChangeNeeded / DENOMINATION[denom]) * DENOMINATION[denom];
      // based on what we have and what we need, determine how much goes into change array
      const changeToGive = neededInDenom >= availableInDenom ? availableInDenom : neededInDenom;
      
      // subtract from remaining change needed
      remChangeNeeded = (remChangeNeeded - changeToGive).toFixed(2);
      // insert into array
      if (changeToGive > 0.00) change.push([denom, changeToGive]);
    });

    if (remChangeNeeded > 0) {
      // we have more than balance needed, but not in the right denominations
      status = STATUS.INSUFFICIENT_FUNDS;
      change = [];
    } else {
      // we have the denomination combination to meet change due, and some left over after
      status = STATUS.OPEN;
    }
  } else if (cashTotal(cid) === changeNeeded) {
    // ELSE IF - we have exact change with everything we have
    status = STATUS.CLOSED;
    change = cid;
  } else {
    // ELSE - we do not have enough cash in drawer to meet change due
    status = STATUS.INSUFFICIENT_FUNDS;
    change = [];
  }

  return { status, change };
}

console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));

