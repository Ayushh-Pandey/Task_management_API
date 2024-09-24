const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');
require('dotenv').config();

const generateToken = (id)=>{
    // the token will be issued on the user id,
    
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:'30m',
    })
}

const authenticate = async(req,res,next)=>{
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            const token = req.headers.authorization.split(' ')[1];

            const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

            req.user = await User.findById(decode.id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({message:'Not authorized,token failed'})
        }
    }
}

module.exports = {generateToken,authenticate}