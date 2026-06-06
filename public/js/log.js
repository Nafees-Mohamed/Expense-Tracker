document.querySelector('.logForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email=document.querySelector('.loginEmail').value;
    const password=document.querySelector('.loginPassword').value;

    const res=await fetch('/api/auth/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });
    const result=await res.json();
    

    if(res.ok){
        localStorage.setItem('accessToken',result.accessToken);
        window.location.href = '/html/expense.html';  
    } else {
        alert(result.message); 
    }
});