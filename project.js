// 1. Deposit some money
// 2. Determine number of lines to bet on
// 2. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again / Game over (No money left)

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { // You may use  A  instead of "A" for keys/attribute in Javascript. But that is required in python
  "💎": 2, // "A": 2,
  "💰": 4, // "B": 4,
  "🍀": 6, // "C": 6,
  "🍒": 8, // "D": 8
}

const SYMBOL_VALUES = {
  "💎": 5, // "A": 5,
  "💰": 4, // "B": 4,
  "🍀": 3, // "C": 3,
  "🍒": 2, // "D": 2
}

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount); // changes string into number. wrong input? NaN (Not a number)
    
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount try again");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);
    
    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again");
    } else {
      return numberOfLines;
    }
  }
}

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);
    
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, try again");
    } else {
      return numberBet;
    }
  }
}

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { // That's going to loop through all of the different entries in our symbol count.
    for (let i = 0; i < count; i++) {
      symbols.push(symbol); // .unshift(1, -5) -> insert to array's first index  .push(1, -5) -> insert to array's highest index  .shift() -> removes the array's first index  .pop() -> removes the array's last index  .splice(0, 4) -> removes the array's 1st-4th index  .splice(-2) -> removes the array's last 2 indexes
    }
  }
  
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]); // Add another array ( a reel column ) into the reels array. Allows for dynamic number of reels
    const reelSymbols = [...symbols]; // copy the symbols that we have available to choose for each real.
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
}

const printRows = (rows) => { // remember that rows is a 2D array
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if ( i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
}

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;

    console.log("You won, $" + winnings.toString());
    if (balance <= 0) {
      console.log("you ran out of money!")
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n): ");

    if (playAgain != "y") break;
  }
}

game();
