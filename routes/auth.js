const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const cookieparser=require('cookie-parser');
const User=require('../models/User');


router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const hash=await bcrypt.hash(password,10);
        const user =new User({username,email,password:hash});
        await user.save();
        res.json({user:user,message:'Registered successfully'});

    }
    catch(err){
        res.status(404).send(err);

    }


});

router.post('/login',async (req,res)=>{
    try{
        const{email,password}=req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Wrong password' });
        
        const accessToken=jwt.sign({userId:user._id},process.env.JWT_ACCESS_TOKEN,{expiresIn: "15m"});
        const refreshToken=jwt.sign({userId:user._id},process.env.JWT_REFRESH_TOKEN);
        
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        });
        res.status(200).send({accessToken,message:'login successful'});
    }catch(err){
        res.status(404).json({msg:'login failed',err});

    }
});

router.post('/refresh', (req,res)=>{
    const token =req.cookies.refreshToken;
    if(!token) return res.status(401).json({message:'No refresh Token'});

    try{
        const decoded=jwt.verify(token,process.env.JWT_REFRESH_TOKEN);
        const accessToken=jwt.sign({userId:decoded.userId},process.env.JWT_ACCESS_TOKEN,{expiresIn:'15m'});

        res.json({accessToken});
    }catch {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});

router.get('/register',async(req,res)=>{
    try{
        const userInfo=await User.find();
        res.status(200).send(userInfo);
    }catch(err){
        res.status(404).send(err);
    }
  
});


router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});

router.delete('/userdelete/:id',async(req,res)=>{
    try{
        const deleted=await User.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({message:"Transaction id not Found..."});
        }
        res.json({message:'Deleted'});
    }
    catch(error){
        res.status(500).json({message:'Error deleting',error});
    }
});

module.exports=router;