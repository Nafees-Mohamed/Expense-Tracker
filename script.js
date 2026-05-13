expenses=[]; 

document.querySelector('.js-add').addEventListener('click',addTransaction);
const history = document.querySelector('.expense-history');
    
function addTransaction(){
    const amount=document.querySelector('.js-amount').value;
    const description=document.querySelector('.js-description').value;
    const category=document.querySelector('.js-category').value;
    const type=document.querySelector('.js-type').value;

    let expense={
        id: Date.now(),
        amount: amount,
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
}


