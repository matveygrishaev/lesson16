"use strict";
// 
let start = document.getElementById("start"),
  btnPlus = document.getElementsByTagName("button"),
  cancel = document.querySelector("#cancel"),
  incomePlus = btnPlus[0],
  expensesPlus = btnPlus[1],
  additionalIncomeItem = document.querySelectorAll(".additional_income-item"),
  checkBox = document.querySelector("#deposit-check"),
  budgetDayValue = document.getElementsByClassName("budget_day-value")[0],
  budgetMonthValue = document.getElementsByClassName("budget_month-value")[0],
  expensesMonthValue = document.getElementsByClassName("expenses_month-value")[0],
  accumulatedMonthValue = document.getElementsByClassName("accumulated_month-value")[0],
  additionalIncomeValue = document.getElementsByClassName("additional_income-value")[0],
  additionalExpensesValue = document.getElementsByClassName("additional_expenses-value")[0],
  incomePeriodValue = document.getElementsByClassName("income_period-value")[0],
  targetMonthValue = document.getElementsByClassName("target_month-value")[0],
  salaryAmount = document.querySelector(".salary-amount"),
  incomeTitle = document.querySelector(".income-title"),
  expensesTitle = document.querySelector(".expenses-title"),
  expensesItems = document.querySelectorAll(".expenses-items"),
  additionalExpenses = document.querySelector(".additional_expenses"),
  periodSelect = document.querySelector(".period-select"),
  periodAmount = document.querySelector(".period-amount"),
  additionalExpensesItem = document.querySelector(".additional_expenses-item"),
  targetAmount = document.querySelector(".target-amount"),
  incomeItems = document.querySelectorAll(".income-items");

const AppData = function () {
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.income = {};
  this.incomeMonth = 0;
  this.addIncome = [];
  this.expenses = {};
  this.expensesMonth = 0;
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
};

AppData.prototype.start = function () {

  if (salaryAmount.value === "") {   
    return;
  }
  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.getExpenseMonth();
  this.getAddExpenses();
  this.getAddIncome();
  this.getBudget();

  this.showResult();
  this.blocked();  
};

AppData.prototype.check = function () {
  salaryAmount.value = salaryAmount.value.replace(/[^0-9]/, "");
  if (salaryAmount.value.trim() === "") {    
    start.disabled = true;
  } else {
    start.disabled = false;
  }
};

AppData.prototype.showResult = function () {
  const _this = this;

  budgetMonthValue.value = this.budgetMonth;
  budgetDayValue.value = this.budgetDay;
  expensesMonthValue.value = this.expensesMonth;
  additionalExpensesValue.value = this.addExpenses.join(", ");
  additionalIncomeValue.value = this.addIncome.join(", ");
  targetMonthValue.value = this.getTargetMonth();
  incomePeriodValue.value = this.calcPeriod();
  periodSelect.addEventListener("change", function () {
    incomePeriodValue.value = _this.calcPeriod();
  });
};

AppData.prototype.blocked = function () {
  document
    .querySelectorAll('.data input[type="text"]')
    .forEach(function (item) {
      item.disabled = true;
    });
  start.style.display = "none";
  cancel.style.display = "block";
};

AppData.prototype.additionalIncomeBlock = function () {
  let cloneIncomeItem = incomeItems[0].cloneNode(true);
  incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
  incomeItems = document.querySelectorAll(".income-items");
  if (incomeItems.length === 3) {
    incomePlus.style.display = "none";
  }
};

AppData.prototype.additionalExpensesBlock = function () {
  let cloneExpensesItem = expensesItems[0].cloneNode(true);
  // вставляем cloneExpensesItem перед expensesPlus
  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
  expensesItems = document.querySelectorAll(".expenses-items");
  if (expensesItems.length === 3) {
    expensesPlus.style.display = "none";
  }
};

AppData.prototype.getExpenses = function () {
  const _this = this;
  expensesItems.forEach(function (item) {
    let itemExpenses = item.querySelector(".expenses-title").value;
    let cashExpenses = item.querySelector(".expenses-amount").value;

    if (itemExpenses !== "" && cashExpenses !== "") {
      _this.expenses[itemExpenses] = cashExpenses;
    }
  });
};

AppData.prototype.getIncome = function () {
  incomeItems.forEach((item) => {
    let itemIncome = item.querySelector(".income-title").value;
    let cashIncome = item.querySelector(".income-amount").value;

    if (itemIncome !== "" && cashIncome !== "") {
      this.income[itemIncome] = cashIncome;

      for (let key in this.income) {
        this.incomeMonth += +this.income[key];
      }
    }
  });
};

AppData.prototype.getAddExpenses = function () {
  let addExpenses = additionalExpensesItem.value.split(", ");
  addExpenses.forEach((item) => {
    item = item.trim();
    if (item !== "") {
      this.addExpenses.push(item);
    }
  });
};

AppData.prototype.getAddIncome = function () {
  const _this = this;
  additionalIncomeItem.forEach(function (item) {
    let itemValue = item.value.trim();
    if (itemValue !== "") {
      _this.addIncome.push(itemValue);
    }
  });
};

AppData.prototype.getInfoDeposit = function () {
  this.deposit = confirm("Есть ли у вас депозит в банке?");
  if (this.deposit) {
    this.percentDeposit = prompt("Какой годовой процент?", "10");
    this.moneyDeposit = prompt("Какая сумма заложена?", 100000);
  }
};

AppData.prototype.getPeriodAmount = function () {
  let period = periodSelect.value;
  periodAmount.textContent = period;
};

AppData.prototype.getExpenseMonth = function () {
  for (let key in this.expenses) {
    this.expensesMonth += +this.expenses[key];
  }
};

AppData.prototype.getBudget = function () {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = Math.ceil(this.budgetMonth / 30);
};

AppData.prototype.getTargetMonth = function () {
  return Math.ceil(targetAmount.value / this.budgetMonth);
};

AppData.prototype.getStatusIncome = function () {
  if (this.budgetDay > 800) {
    return "Высокий уровень дохода";
  } else if (this.budgetDay > 300) {
    return "Средний уровень дохода";
  } else if (this.budgetDay > 0) {
    return "Низкий уровень дохода";
  } else {
    return "Что-то пошло не так";
  }
};

AppData.prototype.calcPeriod = function () {
  return this.budgetMonth * periodSelect.value;
};

AppData.prototype.reset = function () {
  let inputTextData = document.querySelectorAll(".data input[type = text]"),
    resultInputAll = document.querySelectorAll(".result input[type = text]");

  inputTextData.forEach(function (elem) {
    elem.value = "";
    elem.removeAttribute("disabled");
    periodSelect.value = "0";
    periodAmount.innerHTML = periodSelect.value;
  });

  resultInputAll.forEach(function (elem) {
    elem.value = "";
  });

  for (let i = 1; i < incomeItems.length; i++) {
    incomeItems[i].remove();
    incomePlus.style.display = "block";
  }
  for (let i = 1; i < expensesItems.length; i++) {
    expensesItems[i].remove();
    expensesPlus.style.display = "block";
  }

  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.income = {};
  this.incomeMonth = 0;
  this.addIncome = [];
  this.expenses = {};
  this.expensesMonth = 0;
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;

  cancel.style.display = "none";
  start.style.display = "block";
  incomePlus.removeAttribute("disabled");
  expensesPlus.removeAttribute("disabled");
  checkBox.checkbox = false;
};


const appData = new AppData();


AppData.prototype.EventListeners = function () {
  start.setAttribute("disabled", "true");
  const _this = this;
  salaryAmount.addEventListener("input", this.check);
  start.addEventListener("click", AppData.prototype.start.bind(_this));
  cancel.addEventListener("click", AppData.prototype.reset.bind(_this));
  
  expensesPlus.addEventListener("click", this.additionalExpensesBlock);
  incomePlus.addEventListener("click", this.additionalIncomeBlock);
  periodSelect.addEventListener("change", this.getPeriodAmount);
};

appData.EventListeners();
