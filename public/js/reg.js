
document.querySelector('.regForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const username=document.querySelector('.username').value;
    const email=document.querySelector('.email').value;
    const password=document.querySelector('.password').value;

      
    const confirmPassword = document.querySelector('.confirmPassword').value;
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    let user={
        username,
        email,
        password
    };
    const res=await fetch('/api/auth/register',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(user)
    });

    if(res.ok){
        alert('Registartion successful');
        window.location.href='/html/log.html';
    }
})