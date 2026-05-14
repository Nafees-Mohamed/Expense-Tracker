let expenses=[]; 

document.querySelector('.js-add').addEventListener('click',addTransaction);
const history = document.querySelector('.expense-history');
const summary = document.querySelector('.balance-summary');


function addTransaction(){
    const amount=document.querySelector('.js-amount').value;
    const description=document.querySelector('.js-description').value;
    const category=document.querySelector('.js-category').value;
    const type=document.querySelector('.js-type').value;

    let expense={
        id: Date.now(),
        amount: Number(amount),
        description: description,
        type:type,
        category:category
    }

    expenses.push(expense);
    
    console.log(expenses);

        history.innerHTML += `
        <div>$${expense.amount}</div>
        <div>${expense.description}</div>
        <div>${expense.type}</div>
        <div>${expense.category}</div>

    `;
    balanceSummary();
}


function balanceSummary(){
    const income=expenses
            .filter(expense => expense.type==='Income')
            .reduce((sum,expense)=>sum+expense.amount,0);
    const expense=expenses
            .filter(expense => expense.type==='Expense')
            .reduce((sum,expense)=>sum+expense.amount,0);
    const balance=income-expense;
    summary.innerHTML=`
    <h2>Balance Summary</h2>
    <h3>Income: $${income}</h3>
    <h3>Expense: $${expense}</h3>
    <h3>Balance: $${balance}</h3>`;

}

