require('dotenv').config();

const express=require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const path=require('path');
const mongoose=require('mongoose');
const dns = require('dns');          

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());


mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
.then(()=> console.log("MongoDB connected.."))
.catch((error)=> console.log("Connection Failed: ", error));




const UserRoutes=require('./routes/auth');
const transactionRoutes=require('./routes/transaction');
const authenticate=require('./middleware/authenticate');


app.use('/api/auth',UserRoutes);
app.use('/api/transactions',authenticate,transactionRoutes);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/html/log.html'));
});



app.listen(process.env.PORT || 5000,()=>{console.log('Server is running..');});

