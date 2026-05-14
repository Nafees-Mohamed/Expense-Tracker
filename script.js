let expenses= JSON.parse(localStorage.getItem('expenses')) || []; 

document.querySelector('.js-add').addEventListener('click',addTransaction);
const history = document.querySelector('.expense-history');
const summary = document.querySelector('.balance-summary');
document.querySelector('.js-all').addEventListener('click',()=>render());
document.querySelector('.js-Income').addEventListener('click',()=>render('Income'));
document.querySelector('.js-Expense').addEventListener('click',()=>render('Expense'));


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
    <h2>Balance Summary</h2>
    <h3>Income: $${income}</h3>
    <h3>Expense: $${expense}</h3>
    <h3>Balance: $${balance}</h3>`;


}


function render(type = 'all'){

    const filtered= type === 'all'
    ?expenses 
    : expenses.filter(e => e.type === type)
    history.innerHTML = "";
    filtered.forEach(filter => {
        history.innerHTML += `
            <div>$${filter.amount}</div>
            <div>${filter.description}</div>
            <div>${filter.type}</div>
            <div>${filter.category}</div>
            <button class="delete-button"onclick="deleteTransaction(${filter.id})">Delete</button>
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