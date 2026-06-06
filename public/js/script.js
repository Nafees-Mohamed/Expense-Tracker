if (!localStorage.getItem('accessToken')) {
    window.location.href = '/html/log.html';
}
document.querySelector('.js-add').onclick=addTransaction;

const summary = document.querySelector('.balance-summary');

document.querySelector('.js-logout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('accessToken');
    window.location.href = '/html/log.html';
});

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

async function addTransaction(){
    const amount=document.querySelector('.js-amount').value;
    if (!amount || amount <= 0) {
        alert('Enter a valid amount');
        return;
    }
    const description=document.querySelector('.js-description').value || 'NULL';
    const category=document.querySelector('.js-category').value;
    const type=document.querySelector('.js-type').value;

    let expense = {
        amount: Number(amount),
        description: description,
        type: type,
        category: category,
        date: new Date().toLocaleDateString() 
    }
    await apiFetch('/api/transactions',{
        method:"POST",
        headers:{'content-type':'application/json'},
        body: JSON.stringify(expense)
    });
    await init();
    
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
        <div class="balance-bar"><p>Your Balance</p>  <span class="amount">₹${balance}</span></div>
    </div>
    <div class="bottom">
        <div class="income-bar"><p><span class="emoji">📈</span>Income</p> <span class="amount">₹${income}</span></div>
        <div class="expense-bar"><p><span class="emoji">📉</span>Expense</p> <span class="amount">₹${expense}</span></div>
    </div>
    `;
}

async function updateTransaction(id) {
    const amount=document.querySelector('.js-amount').value;
        
    if (!amount || amount <= 0) {   
        alert('Enter a valid amount');
        return;
    }
    const description=document.querySelector('.js-description').value;
    const category=document.querySelector('.js-category').value;
    const type=document.querySelector('.js-type').value;
    
    await apiFetch(`/api/transactions/${id}`,{
        method:'PUT',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({amount:Number(amount),description,type,category})
    });

    const btn=document.querySelector('.js-add');
    btn.textContent='Add Transaction';
    btn.onclick=addTransaction;

    document.querySelector('.js-amount').value = '';
    document.querySelector('.js-description').value = '';
    window.history.replaceState({}, '', '/html/expense.html');
    await init();
}
async function init(){
    try {
        const res = await apiFetch('/api/transactions');
        expenses = await res.json();
        balanceSummary();
    } catch (error) {
        summary.innerHTML = `<p>Could not load data. Is the server running?</p>`;
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
        
        const expense = expenses.find(e => e._id === editId);

        if (expense) {

            document.querySelector('.js-amount').value = expense.amount;
            document.querySelector('.js-description').value = expense.description;
            document.querySelector('.js-category').value = expense.category;
            document.querySelector('.js-type').value = expense.type;

            const btn = document.querySelector('.js-add');
            btn.textContent = 'Update Transaction';
            btn.onclick = () => updateTransaction(editId);
        }
    }
}


init();