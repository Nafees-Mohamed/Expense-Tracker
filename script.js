expenses=[]; 

document.querySelector('.js-add').addEventListener('click',addTransaction);
    
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
}


