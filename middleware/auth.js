const jwt=require('jsonwebtoken')
require("dotenv").config()


const auth=(req,res,next)=>
{
    const token=req.headers.authorization
    if(token){
        // console.log("token",token)
        jwt.verify(token,process.env.tokenpass,function(err, decoded) {
            if(decoded){
                console.log("decoded",decoded)
                req.body.userId=decoded.userid
                
                next()
            }else{
                res.status(401).send({"msg":"Wrong Credentials"})
            }
          });
    }else{
        res.status(401).send({"msg":"Login First"})
    }
}
module.exports=auth