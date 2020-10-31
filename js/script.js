'use strict';

let start = document.getElementById('start'),
    btnPlus = document.getElementsByTagName('button'),
    cancel = document.querySelector('#cancel'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    checkBox = document.querySelector('#deposit-check'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    accumulatedMonthValue = document.getElementsByClassName('accumulated_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpenses = document.querySelector('.additional_expenses'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    incomeItems = document.querySelectorAll('.income-items');


class AppData {
  constructor () {
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
  }

  start() {
      this.budget = +salaryAmount.value;
      this.getExpenses();
      this.getIncome();
      this.getExpenseMonth();
      this.getAddExpenses();
      this.getAddIncome();
      this.getBudget();

      this.showResult();

      this.blocked();
      // this.unblocked();
  }

  showResult () {

      const _this = this;

      budgetMonthValue.value = this.budgetMonth;
      budgetDayValue.value = this.budgetDay;
      expensesMonthValue.value = this.expensesMonth;
      additionalExpensesValue.value = this.addExpenses.join(', ');
      additionalIncomeValue.value = this.addIncome.join(', ');
      targetMonthValue.value = this.getTargetMonth();
      incomePeriodValue.value = this.calcPeriod();
      periodSelect.addEventListener('change', function() {
          incomePeriodValue.value = _this.calcPeriod();
      });
  }

  blocked () {
        document.querySelectorAll('.data input[type="text"]').forEach(function(item){
          item.disabled = true;
        });
        start.style.display = 'none';
        cancel.style.display = 'block';
  }

  /*
  unblocked () {
          cancel.addEventListener('click', function(){

            this.reset; //сбросить все

            document.querySelectorAll('.data input[type="text"]').forEach(function(item) {
            item.disabled = false;
            item.value = '';
          });

          document.querySelectorAll('.result input[type="text"]').forEach(function(item){
            item.disabled = false;
            item.value = '';
          });

          start.style.display = 'block';
          cancel.style.display = 'none';

          start.disabled = true;

          salaryAmount.addEventListener('input', function(){
            if (salaryAmount.value.trim() === '') {
              start.disabled = true;
            } else {
              start.disabled = false;
            }
          });
        });
  }
  */

  additionalIncomeBlock  () {
          let cloneIncomeItem = incomeItems[0].cloneNode(true);
          incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
          incomeItems = document.querySelectorAll('.income-items');
          if (incomeItems.length === 3) {
              incomePlus.style.display = 'none';
          }
  }

  additionalExpensesBlock  () {
          let cloneExpensesItem = expensesItems[0].cloneNode(true);
          // вставляем cloneExpensesItem перед expensesPlus
          expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
          expensesItems = document.querySelectorAll('.expenses-items');
          if (expensesItems.length === 3) {
              expensesPlus.style.display = 'none';
          }
  }

  getExpenses ()  {
      const _this = this;
      expensesItems.forEach(function(item) {
                let itemExpenses = item.querySelector('.expenses-title').value;
                let cashExpenses = item.querySelector('.expenses-amount').value;

                if(itemExpenses !== '' && cashExpenses !== '') {
                    _this.expenses[itemExpenses] = cashExpenses;
                }
            });
  }

  getIncome ()  {
          incomeItems.forEach((item) => {
              let itemIncome = item.querySelector('.income-title').value;
              let cashIncome = item.querySelector('.income-amount').value;

              if(itemIncome !== '' && cashIncome !== '') {
                  this.income[itemIncome] = cashIncome;
                
                  
                  for (let key in this.income) {
                      this.incomeMonth += +this.income[key];
                  }
              }
          });
  }

  getAddExpenses  () {
          let addExpenses = additionalExpensesItem.value.split(', ');
          addExpenses.forEach((item => {
            item = item.trim();
            if (item !== '') {
              this.addExpenses.push(item);
            }
          }));
  }

  getAddIncome  () {
      const _this = this;
          additionalIncomeItem.forEach(function(item) {
              let itemValue = item.value.trim();
              if (itemValue !== '') {
                _this.addIncome.push(itemValue);
              }
          });
  }

  getInfoDeposit ()  {
        this.deposit = confirm('Есть ли у вас депозит в банке?');
        if (this.deposit) {
          this.percentDeposit = prompt('Какой годовой процент?', '10');
          this.moneyDeposit = prompt('Какая сумма заложена?', 100000);
        }
  }

  getPeriodAmount  () {
        let period = periodSelect.value;
        periodAmount.textContent = period;
  }

  getExpenseMonth  () {
        for (let key in this.expenses) {
          this.expensesMonth += +this.expenses[key];
        }
  }

  getBudget  () {
          this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
          this.budgetDay = Math.ceil(this.budgetMonth/30);
  }

  getTargetMonth  () {
          return Math.ceil(targetAmount.value / this.budgetMonth);
  }

  getStatusIncome () {
        if (this.budgetDay > 800) {
          return ('Высокий уровень дохода');
        } else if (this.budgetDay > 300) {
          return ('Средний уровень дохода');
        } else if (this.budgetDay > 0) {
          return ('Низкий уровень дохода');
        } else {
          return ('Что-то пошло не так');
        }
  }

  calcPeriod () {
        return this.budgetMonth * periodSelect.value;
  }

  reset() {
        let inputTextData = document.querySelectorAll('.data input[type = text]'),
            resultInputAll = document.querySelectorAll('.result input[type = text]');

        inputTextData.forEach(function (elem){
            elem.value = '';
            elem.removeAttribute('disabled');
            periodSelect.value = '0';
            periodAmount.innerHTML = periodSelect.value;
        });

        resultInputAll.forEach(function(elem){
            elem.value = '';
        });

        for (let i = 1; i < incomeItems.length; i++) {
          incomeItems[i].remove();
          incomePlus.style.display = 'block';
        }
        for (let i = 1; i < expensesItems.length; i++) {
          expensesItems[i].remove();
          expensesPlus.style.display = 'block';
        }

        // for (let i = 1; i < incomeItems.length; i++) {
        //     incomeItems[i].parentNode.removeChild(incomeItems[i]);
        //     incomePlus.style.display = 'block';
        // }

        // for (let i = 1; i < expensesItems.length; i++) {
        //     expensesItems[i].parentNode.removeChild(expensesItems[i]);
        //     expensesPlus.style.display = 'block';
        // }
        
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

        cancel.style.display = 'none';
        start.style.display = 'block';
        incomePlus.removeAttribute('disabled');
        expensesPlus.removeAttribute('disabled');
        checkBox.checkbox = false;
  }

  EventListeners () {
    start.addEventListener('click', this.start.bind(this));
    expensesPlus.addEventListener('click', this.additionalExpensesBlock);
    incomePlus.addEventListener('click', this.additionalIncomeBlock);
    periodSelect.addEventListener('change', this.getPeriodAmount);
    cancel.addEventListener('click', this.reset);
  }
}

// start.addEventListener('click', appData.start.bind(appData));

// expensesPlus.addEventListener('click', appData.additionalExpensesBlock);
// incomePlus.addEventListener('click', appData.additionalIncomeBlock);
// periodSelect.addEventListener('change', appData.getPeriodAmount);
// cancel.addEventListener('click', appData.reset.bind(appData));н

const appData = new AppData();

appData.EventListeners();






