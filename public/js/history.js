if (!localStorage.getItem('accessToken')) {
    window.location.href = '/html/log.html';
}
let expenses=[];
document.querySelector('.js-all').addEventListener('click',()=>loadExpenses());
document.querySelector('.js-Income').addEventListener('click',()=>loadExpenses('Income'));
document.querySelector('.js-Expense').addEventListener('click',()=>loadExpenses('Expense'));
document.querySelector('.js-category-filter').addEventListener('change',()=>{
        const category=document.querySelector('.js-category-filter').value;
        loadExpenses('',category);
    });

const history = document.querySelector('.expense-history');

async function apiFetch(url, options = {}) {
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    let res = await fetch(url, options);

    if (res.status === 401) {
        const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            accessToken = data.accessToken;
            localStorage.setItem('accessToken',accessToken);
            options.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            res = await fetch(url, options); 
        } else {
            window.location.href = '/html/log.html'; 
        }
    }
    return res;
}


function render(){

    history.innerHTML = "";
    expenses.forEach(expense => {
        const isIncome = expense.type === 'Income';
        const amountStyle = isIncome ? 'color:green' : 'color:red';
        const amountSign = isIncome ? '+' : '-';

        history.innerHTML += `
            <div>${expense.date}</div>    
            <div>${expense.description}</div>
            <div>${expense.type}</div>
            <div>${expense.category}</div>
            <div style="${amountStyle}">${amountSign} ₹${expense.amount}</div>
            <button class="update-button" onclick="editTransaction('${expense._id}')">Edit</button>
            <button class="delete-button" onclick="deleteTransaction('${expense._id}')">Delete</button>
           
        `;
    });
}

async function editTransaction(id){
    window.location.href = `/html/expense.html?edit=${id}`;
}


async function deleteTransaction(id){
    await apiFetch(`/api/transactions/${id}`,{
        method:'DELETE'
    });
    await loadExpenses();

}

async function loadExpenses(type='',category=''){
    let url='/api/transactions?';

    if(type) url+=`type=${type}&`;
    if(category) url+=`category=${category}`;
    const res=await apiFetch(url);
    expenses = await res.json();
    render();
}

 loadExpenses();