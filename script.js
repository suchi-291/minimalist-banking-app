'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Chandrashekhar G',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Ankitha Das',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Manasa Madhusudhan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Shwetha perikala',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

////////////////////////////////////////////////////////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


/////////////////////////////////////////////////////////////////////////////////////////////

// Functions
const displayMovements = function(movements, sort = false){

  containerMovements.innerHTML = '';//We want all the html tags to get included, for that reason instead of .textContent, we used innerHTML.

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;//creating copy of movements array using slice() for sort method to be applied without tampering the original array 


  movs.forEach(function(movement, index){
    const type = movement > 0 ? 'deposit' : 'withdrawal';

      const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${type}
          </div>
          
          <div class="movements__value">${movement}₹</div>
      </div>
      `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
    
  };




const calcDisplayBalance = function(account) {
  account.balance = account.movements.reduce((acc, mov)=> acc + mov, 0);
  labelBalance.textContent = `${account.balance}₹ `;
}



const calcDisplaySummary = function(account){
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc,mov) => acc +mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const outcomes = account.movements.filter( mov => mov < 0).reduce((acc,mov)=> acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}₹`;

  const interest = account.movements.filter(mov => mov > 0).map(deposit => deposit * account.interestRate).filter(intr => intr >= 1 ).reduce((acc, intr) => acc + intr);
  labelSumInterest.textContent = `${interest}₹`
}

let userName;
const createUsernames = function(accounts){
  accounts.forEach(function(account){
  account.userName = account.owner.toLowerCase().split(' ').map((word) => word[0]).join('');
  return userName;
});

}

createUsernames(accounts);

const updateUI = function(account){

      // Display transactions
      displayMovements(account.movements);

      // Display Balance
      calcDisplayBalance(account);
      
      // Display Summary
      calcDisplaySummary(account);

}

let sorted = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


//////////////////////////////////////////////////////////////////////////////////////////////////

// Event Handler


// LOGIN IMPLEMENTATION

let currentAccount;
btnLogin.addEventListener('click', function(e){
  //Prevents form from submitting
  e.preventDefault(); 
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  //usecase of optional chaining can be seen here, so we are basically checking if the current account exists, if it exists then only we will check if the pin matches
  if(currentAccount?.pin === Number(inputLoginPin.value)){
      // Display UI and welcome message
      labelWelcome.textContent = `Welcome back! ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

      // Clear input fields 
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur(); //blur method helps to lose focus, so after user logs in, cursor will not be visible

      updateUI(currentAccount);

  }
});


// MONEY TRANSFER IMPLEMENTATION

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  
  if(recieverAcc && amount > 0 && currentAccount.balance >= amount && recieverAcc?.userName !== currentAccount.userName){
        //Doing transfer
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);

        updateUI(currentAccount);

  }
});


// IMPLEMENTATION OF CLOSE ACCOUNT

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  
  const closerAcc = accounts.find(acc => acc.userName === inputCloseUsername.value);
  
  if(closerAcc.userName === currentAccount.userName && closerAcc.pin === Number(inputClosePin.value)){    
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    //Delete account
    accounts.splice(index, 1);//Original array will also get mutated
    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Login to get started`;
      
  }

  inputCloseUsername.value = inputClosePin.value = '';
  

})


// IMPLEMENTATION OF LOAN LENDING

btnLoan.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1 )){

      // Add movement
      currentAccount.movements.push(amount);

      //update UI
      updateUI(currentAccount);
    }
})




