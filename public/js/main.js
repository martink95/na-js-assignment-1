const bankBalanceElement = document.getElementById("bank-balance");
const workBalanceElement = document.getElementById("work-balance");
const workButton = document.getElementById("work-button");
const bankButton = document.getElementById("bank-button");
const loanButton = document.getElementById("loan-button");
const repayButton = document.getElementById("repay-button");
const errorMessageElement = document.getElementById("balance-error");
const outstandingLoanElement = document.getElementById("outstanding-loan-balance");
const laptopSelectionElement = document.getElementById("laptop-selection");
const selectedLaptopCard = document.getElementById("laptop-selected-card");

let balance = 0;
let loanBalance = 0;

bankBalanceElement.innerHTML = balance;
workBalanceElement.innerHTML = 0;

workButton.addEventListener("click", () => {
    balance = parseInt(workBalanceElement.innerHTML);
    workBalanceElement.innerHTML = "";
    balance += 100;
    workBalanceElement.insertAdjacentText("beforeend", balance);
})

bankButton.addEventListener("click", () => {
    let workBalance = parseInt(workBalanceElement.innerHTML);
    let bankBalance = parseInt(bankBalanceElement.innerHTML);
    let balance =  bankBalance + workBalance;
    if(loanBalance > 0) balance =  bankBalance + (workBalance*.90);
    else balance = bankBalance + workBalance;
    bankBalanceElement.innerHTML = "";
    bankBalanceElement.insertAdjacentText("beforeend", balance);
    if(loanBalance > 0) {
        loanBalance = loanBalance - (workBalanceElement.innerHTML * 0.10);
        outstandingLoanElement.innerHTML = getOutstandingLoanString();
    }
    workBalanceElement.innerHTML = 0;
})

loanButton.addEventListener("click", () => {
    if(loanBalance > 0) {
        errorMessageElement.innerHTML = "You can't get a loan at this time.";
    }
    else {
        balance = parseInt(bankBalanceElement.innerHTML);
        loanBalance = parseInt(prompt("How much loan do you want?"));  
        if(loanBalance > balance*2) {
            loanBalance = 0;
            errorMessageElement.innerHTML = `You can't borrow more than ${balance*2} NOK :(`
        }
        else {
            outstandingLoanElement.innerHTML = getOutstandingLoanString();
            bankBalanceElement.innerHTML = balance + loanBalance;
        }
    }
})

repayButton.addEventListener("click", () => {
    if(loanBalance > 0) {
        let workBalance = parseInt(workBalanceElement.innerHTML);
        let diff = repayLoan(workBalance);
        workBalanceElement.innerHTML = diff;
        outstandingLoanElement.innerHTML = getOutstandingLoanString();
    }
})

const repayLoan = (amount) => {
    let diff = 0;
    if(loanBalance > amount) {
        loanBalance -= amount;
    } else {
        diff = Math.abs(loanBalance - amount)
        loanBalance = 0;
    }
    return diff;
}

const getOutstandingLoanString = () => {
    return `Outstanding loan: ${loanBalance} NOK`;
}

let laptopInformation = fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
.then(res => res.json())
.then(data => createLaptopSelection(data));

let createLaptopSelection = (data) => {
    for(let laptop of data) {
        laptopSelectionElement.appendChild(new Option(laptop.title, laptop.id))
    }
    //createFeaturesList(data[0])
    createLaptopInformation(data[0]);
}

let createFeaturesList = (features) => {
    const featuresList = document.getElementById("features-list");
    for(let feature of features) {
        let featureItem = document.createElement("LI");
        featureItem.appendChild(feature)
        featuresList.appendChild(featureItem);
    }
}

let createLaptopInformation = (laptop) => {
    selectedLaptopCard.innerHTML = `
    <img src="https://noroff-komputer-store-api.herokuapp.com/${laptop.image}" alt="${laptop.title}"/>
    <div class="small-container">
        <p class="card-heading" id="laptop-heading">${laptop.title}</p>
        <p id="laptop-description">${laptop.description}</p>
    </div>
    <div class="small-container">
        <p class="card-paragraph"><span id="laptop-price">${laptop.price}</span> NOK</p>
        <button id="laptop-buy-button" data-price="${laptop.price} data-title="${laptop.title}"}>Buy now</button>
    </div>`;
}

const laptopBuyButton = document.getElementById("laptop-buy-button");
laptopBuyButton.addEventListener("click", () => {

})
let buyLaptop = (laptopPrice) => {
    if(laptopPrice < balance) {
        alert("You've successfully bought a new computer.")
    }
}
