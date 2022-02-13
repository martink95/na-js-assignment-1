const bankBalanceElement = document.getElementById("balance__bank");
const workBalanceElement = document.getElementById("balance__work");
const workButton = document.getElementById("btn__work");
const bankButton = document.getElementById("btn__bank");
const loanButton = document.getElementById("btn__loan");
const repayButton = document.getElementById("btn__repay");
const errorMessageElement = document.getElementById("error__balance");
const outstandingLoanElement = document.getElementById("balance__outstanding-loan");
const laptopSelectionElement = document.getElementById("laptop__select");
const selectedLaptopCard = document.getElementById("selected__card");

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

let laptopInformation = () => fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
.then(res => res.json())
.then(data => {
    createLaptopSelection(data),
    createFeaturesList(data[0].specs)
    createLaptopInformation(data[0])
});

let createLaptopSelection = (data, id) => {
    if(id == null) id = 0;
    let _id = id;
    for(let laptop of data) {
        laptopSelectionElement.appendChild(new Option(laptop.title, laptop.id))
    }
}
laptopInformation();

let createFeaturesList = async (features) => {
    const featuresList = document.getElementById("features__list");
    featuresList.innerHTML = "";
    for(let feature of features) {
        featuresList.innerHTML += `<li>${feature}</li>`;
    }
};

let createLaptopInformation = (laptop) => {
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

let buyLaptop = (laptopPrice) => {
    if(laptopPrice <= balance) {
        balance -= laptopPrice;
        bankBalanceElement.innerHTML = balance;
        alert(`You've successfully bought a new computer for ${laptopPrice} NOK`)
    }
    else {
        alert("You can't afford this product yet, please work more.")
    }

}

laptopSelectionElement.addEventListener("change", (e) => {
    let laptopInformation = () => fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
.then(res => res.json())
.then(data => {
    createFeaturesList(data[1].specs)
    createLaptopInformation(data[1])
});
    
})