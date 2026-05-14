let expenses= JSON.parse(localStorage.getItem('expenses')) || []; 

document.querySelector('.js-add').addEventListener('click',addTransaction);
const history = document.querySelector('.expense-history');
const summary = document.querySelector('.balance-summary');
document.querySelector('.js-all').addEventListener('click',()=>render());
document.querySelector('.js-Income').addEventListener('click',()=>render('Income'));
document.querySelector('.js-Expense').addEventListener('click',()=>render('Expense'));


function addTransaction(){
    const amount=document.querySelector('.js-amount').value;
    const description=document.querySelector('.js-description').value || 'NULL';
    const category=document.querySelector('.js-category').value;
    const type=document.querySelector('.js-type').value;

let expense = {
    id: Date.now(),
    amount: Number(amount),
    description: description,
    type: type,
    category: category,
    date: new Date().toLocaleDateString() 
}

    expenses.push(expense);
    saveToStorage();
    render();
    balanceSummary();

    document.querySelector('.js-amount').value = '';
    document.querySelector('.js-description').value = ''; 
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
    <div class="top">
        <div class="balance-bar"><p>Your Balance</p>  <span class="amount">$${balance}</span></div>
    </div>
    <div class="bottom">
        <div class="income-bar"><p>Income</p> <span class="amount">$${income}</span></div>
        <div class="expense-bar"><p>Expense</p> <span class="amount"> $${expense}</span></div>
    </div>
    `;


}


function render(type = 'all'){

    const filtered= type === 'all'
    ?expenses 
    : expenses.filter(e => e.type === type)
    history.innerHTML = "";
    filtered.forEach(expense => {
        history.innerHTML += `
            <div>${expense.date}</div>
            <div>$${expense.amount}</div>
            <div>${expense.description}</div>
            <div>${expense.type}</div>
            <div>${expense.category}</div>
            <button class="delete-button"onclick="deleteTransaction(${expense.id})">Delete</button>
        `;
    })
}

function saveToStorage(){
    localStorage.setItem('expenses',JSON.stringify(expenses));
}

function deleteTransaction(id){
    expenses=expenses.filter(e => e.id!== id);
    saveToStorage();
    render();
    balanceSummary();

}
render();
balanceSummary();