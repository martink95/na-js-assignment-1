import {
    bankBalanceElement, 
    workBalanceElement,
    workButton,
    bankButton,
    loanButton,
    repayButton,
    errorMessageElement,
    outstandingLoanElement,
    laptopSelectionElement,
    selectedLaptopCard
} from'./uiElements.js'; 
import { getLaptopInformation } from './api.js';

let laptopList = await getLaptopInformation();
let balance = 0;
let loanBalance = 0;

/*
    DRAW HTML ELEMENTS from API data
*/
const createLaptopSelection = (data) => {
    let id = 0;
    let _id = data.id;
    laptopSelectionElement.innerHTML = "";
    for(let laptop of data) {
        let opt = new Option(laptop.title, laptop.id);
        laptopSelectionElement.appendChild(opt)
    }
}

const createFeaturesList = async (features) => {
    const featuresList = document.getElementById("features__list");
    featuresList.innerHTML = "";
    for(let feature of features.specs) {
        featuresList.innerHTML += `<li>${feature}</li>`;
    }
};

const createLaptopInformation = (laptop) => {
    selectedLaptopCard.innerHTML = `
    <img src="https://noroff-komputer-store-api.herokuapp.com/${laptop.image}" alt="${laptop.title}"/>
    <div class="container--small">
        <p class="card__heading" id="laptop__heading">${laptop.title}</p>
        <p id="laptop__description">${laptop.description}</p>
    </div>
    <div class="container--small">
        <p class="card__paragraph"><span id="laptop-price">${laptop.price}</span> NOK</p>
        <button class="btn btn-primary" id="btn__buy" value="${laptop.id}"}>Buy now</button>
    </div>`;
    const laptopBuyButton = document.getElementById("btn__buy");
    laptopBuyButton.addEventListener("click", () => {
        buyLaptop(laptop.price);
    })
}

createLaptopSelection(laptopList, laptopList[0].id);
createFeaturesList(laptopList[0]);
createLaptopInformation(laptopList[0]);

bankBalanceElement.innerHTML = balance;
workBalanceElement.innerHTML = 0;

/* 
    EVENT LISTENERS
*/
workButton.addEventListener("click", () => {
    balance = parseInt(workBalanceElement.innerHTML);
    workBalanceElement.innerHTML = "";
    balance += 100;
    workBalanceElement.insertAdjacentText("beforeend", balance);
})

bankButton.addEventListener("click", () => {
    let workBalance = parseInt(workBalanceElement.innerHTML);
    let bankBalance = parseInt(bankBalanceElement.innerHTML);
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
            balance += loanBalance;
            bankBalanceElement.innerHTML = balance;
        }
    }
})

repayButton.addEventListener("click", () => {
    if(loanBalance > 0) {
        let workBalance = parseInt(workBalanceElement.innerHTML);
        let diff = repayLoan(workBalance);
        workBalance -= diff;
        workBalanceElement.innerHTML = workBalance;
        outstandingLoanElement.innerHTML = getOutstandingLoanString();
    }
})

laptopSelectionElement.addEventListener("change", function() {
    createLaptopInformation(laptopList[this.value-1]);
    createFeaturesList(laptopList[this.value-1]);
}) 

/*
    FUNCTIONS
*/
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

const buyLaptop = (laptopPrice) => {
    if(laptopPrice <= balance) {
        console.log(`b_:${balance} - l_:${laptopPrice} = ${balance-laptopPrice}`);
        balance -= laptopPrice;
        bankBalanceElement.innerHTML = balance;
        alert(`You've successfully bought a new computer for ${laptopPrice} NOK`)
        console.log(balance);
    }
    else {
        alert("You can't afford this product yet, please work more.")
    }
}