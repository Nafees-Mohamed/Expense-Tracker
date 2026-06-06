const jwt=require('jsonwebtoken');

function authenticate(req,res,next){
    const token=req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({message:'No token'});


    try{
        const decode=jwt.verify(token,process.env.JWT_ACCESS_TOKEN);
        req.userId=decode.userId;
        next();
    }
    catch(err){
        res.status(401).json({message:"Token expired"});
    }
}

module.exports=authenticate;