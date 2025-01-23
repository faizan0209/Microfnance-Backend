const jwt = require('jsonwebtoken');

const isAuthenticated=(req,res,next)=>{
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403)
        .json({message: "invalid, jwt token is required"})
    }
    try{
        const decode = jwt.verify(auth,process.env.JWT_SECRET);
        req.existingUser = decode;
        next();
    }
    catch(err){
        return res.status(403)
        .json({message: "invalid, jwt is expired"})
    }
}

module.exports={
    isAuthenticated
}