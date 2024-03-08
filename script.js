let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const saveAmountButton = document.getElementById("save-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // Adjust for zero-based indexing
const day = today.getDate();

const expenseDate = `${day}-${month}-${year}`;

let tempAmount;
let tempTitle;
let tempCost;

if(localStorage.getItem("totalBudget") === NaN || localStorage.getItem("totalBudget") == null) {
  tempAmount = 0;
  amount.innerHTML=tempAmount;
  balanceValue.innerHTML=parseInt(amount.innerHTML)-tempAmount;
  expenditureValue.innerHTML = 0;
}

else{
  tempAmount = parseInt(localStorage.getItem("totalBudget")) ;
  amount.innerHTML=tempAmount;
  balanceValue.innerHTML=localStorage.getItem("balance");
}

if(localStorage.getItem("totalExpenses")){
  expenditureValue.innerHTML=localStorage.getItem("totalExpenses");
}else{
  expenditureValue.innerHTML=0;
}

const expenseArr = [];
getExpenses();

let dayTomodify = 0;
let monthTomodify = 0;
let yearTomodify = 0;

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  let parentText = parentDiv.querySelector(".product").innerText;
  let parentDate = parentDiv.querySelector(".date").innerText;

  // Split the date string into an array using the hyphen (-) as delimiter
  const dateParts = parentDate.split("-");

  // Extract day, month, and year as separate variables
  dayTomodify = parseInt(dateParts[0]);
  monthTomodify = parseInt(dateParts[1]);
  yearTomodify = parseInt(dateParts[2]);


  if (edit) {
    checkAmountButton.classList.add("hide");
    saveAmountButton.classList.remove("hide");
    

    productTitle.value = parentText;
    userAmount.value = parentAmount;

    tempTitle=productTitle.value;
    tempCost=userAmount.value;
  }
  else {
    
    expenseArr.forEach((expenseObj, objIndex) => {
      if (
        expenseObj.day === dayTomodify &&
        expenseObj.month === monthTomodify &&
        expenseObj.year === yearTomodify
      ) {
        
        expenseObj.expenses.forEach((expense, index) => {
          
          if (expense.title === parentText && expense.amount == parentAmount) {
            expenseObj.expenses.splice(index, 1);
            const balance = parseFloat(localStorage.getItem("balance"));
            const totalExpenses = parseFloat(localStorage.getItem("totalExpenses"));

            const totalSum = parseFloat(expenditureValue.innerHTML) - parseFloat(parentAmount);
      
            localStorage.setItem("totalExpenses", totalSum);
            expenditureValue.innerHTML = totalSum;

            balanceValue.innerHTML = parseFloat(localStorage.getItem("totalBudget")) - totalSum;

            localStorage.setItem("balance", (parseFloat(localStorage.getItem("totalBudget")) - totalSum));
            saveExpenses();
            window.location.reload();
          }
        });
        if(expenseObj.expenses.length==0){
          expenseArr.splice(objIndex, 1);
          saveExpenses();
          window.location.reload();
        }
      }
    });
  }
};
//Set Budget Part
totalAmountButton.addEventListener("click", () => {
  
  //empty or negative input
  if (totalAmount.value === "" || totalAmount.value < 0 ) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    tempAmount += parseInt(totalAmount.value);
    //Set Budget
    amount.innerHTML = tempAmount;
    //Set Balance
    balanceValue.innerText = tempAmount - expenditureValue.innerText;

    localStorage.setItem("totalBudget", tempAmount);
    localStorage.setItem("balance", parseFloat(balanceValue.innerText));
    //Clear Input Box
    totalAmount.value = "";
  }
});

checkAmountButton.addEventListener("click", () => {
  //empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  //Enable buttons
  //disableButtons(false);
  //Expense
  let expenditure = parseFloat(userAmount.value);
  //Total expense (existing + new)
  let sum = parseFloat(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  localStorage.setItem("totalExpenses", sum);
  //Total balance(budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  localStorage.setItem("balance", totalBalance);

  let expenseExist = false;
  expenseArr.forEach((expense) => {
    if (
      expense.day === day &&
      expense.month === month &&
      expense.year === year
    ) {
      expense.expenses.forEach((expense) => {
        if (expense.title === productTitle.value && expense.amount == userAmount.value) {
          expenseExist = true;
        }
      });
    }
  });
  if (expenseExist) {
    alert("Expense already added");
    return;
  }
  const newExpense = {
    title: productTitle.value,
    amount: expenditure,
  };
  //console.log(newExpense);
  let expenseAdded = false;
  if (expenseArr.length > 0) {
    expenseArr.forEach((item) => {
      if (
        item.day === day &&
        item.month === month &&
        item.year === year
      ) {
        item.expenses.push(newExpense);
        expenseAdded = true;
      }
    });
  }

  if (!expenseAdded) {
    expenseArr.push({
      day: day,
      month: month,
      year: year,
      expenses: [newExpense],
    });
  }

  console.log(expenseArr);
  saveExpenses();
  window.location.reload();
  //Empty inputs
  productTitle.value = "";
  userAmount.value = "";
});

saveAmountButton.addEventListener("click", () =>{
  
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }

  expenseArr.forEach((expenseObj) => {

    if (
      expenseObj.day === dayTomodify &&
      expenseObj.month === monthTomodify &&
      expenseObj.year === yearTomodify
    ) {
      expenseObj.expenses.forEach((expense) => {
        
        if (expense.title === tempTitle && expense.amount == tempCost) {
          expense.title = productTitle.value;
          expense.amount = parseFloat(userAmount.value);
          const balance = parseFloat(localStorage.getItem("balance"));
          const totalExpenses = parseFloat(localStorage.getItem("totalExpenses"));

          const totalSum = parseFloat(expenditureValue.innerHTML) - parseFloat(tempCost) + parseFloat(userAmount.value);
          
          localStorage.setItem("totalExpenses", totalSum);
          expenditureValue.innerHTML = totalSum;

          balanceValue.innerHTML = parseFloat(localStorage.getItem("totalBudget")) - totalSum;

          localStorage.setItem("balance", (parseFloat(localStorage.getItem("totalBudget")) - totalSum));

          saveExpenses();
          window.location.reload();
        }
      });
    }
  });

});
function saveExpenses() {
  if(expenseArr.length==0){
    localStorage.removeItem("expenses");
    return;
  }
  localStorage.setItem("expenses", JSON.stringify(expenseArr));
}

function getExpenses() {
  
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("expenses") === null) {
    list.innerHTML=`<div class="no-expense">
    <h3>No expenses</h3>
    </div>`;
    return;
  }
  expenseArr.push(...JSON.parse(localStorage.getItem("expenses")));
  updateExpenses();
}

function updateExpenses(){
  
  expenseArr.forEach((exp) => {
    exp.expenses.forEach((expense) => {
      const expenseDate = `${exp.day}-${exp.month}-${exp.year}`;
      const sublistContent = document.createElement("div");
      sublistContent.classList.add("sublist-content", "flex-space");

      // Add content to the sublist
      sublistContent.innerHTML = `
        <p class="product">${expense.title}</p>
        <p class="amount">${expense.amount}</p>
        <p class="date">${expenseDate}</p>
      `;

      // Create and add edit button
      const editButton = document.createElement("button");
      editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
      editButton.style.fontSize = "1.2em";
      
      editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
      });
      sublistContent.appendChild(editButton);

      // Create and add delete button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("fa-solid", "fa-trash", "delete");
      deleteButton.style.fontSize = "1.2em";
      
      deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
      });
      sublistContent.appendChild(deleteButton);

      // Append the sublist content to the list
      document.getElementById("list").appendChild(sublistContent);
    });
    
  });
  saveExpenses();
}