const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler");

exports.register = [ // Add later a email verifitcation request , temp add on database but no verified in 1 hour it gets deleted.
    body("Username" ,"Required to input Username.").trim().isLength({min:3}).escape()
    .custom(async(Username)=>{
        try {
            const usernameExists = await User.findOne({Username:Username}).exec()
            if(usernameExists)
                {
                    return res.status(409).json({message:"Username already Exists"})
                }
        } catch (error) {
                return res.status(404).json({error:error})
        }
    }),
    body("Email" ,"Required to input Email.").trim().isLength({min:15}).escape()
    .custom(async(Email)=>{
        try {
            const EmailExists = await User.findOne({Email:Email}).exec()
            if(EmailExists)
                {
                    return res.status(409).json({message:"Email already Exists"})
                }
        } catch (error) {
                return res.status(404).json({error:error})
        }
    }),
    body("Password" , "Required to input Password").trim().isLength({min:8}).escape(),
    asyncHandler(async(req,res,next)=>{
        if(!errors.isEmpty())
            {
                return res.status(403).json(
                    {
                        username : req.body.Username,
                        errors : errors.array()
                    })
            }
        const HashedPassword = await bcrypt.hash(req.body.Password);
//add it here
        const user = new User({
            Username:req.body.Username,
            Email:req.body.Email,
            password: HashedPassword,
        })
        await user.save();
        res.status(201).json({message:"User Created SuccessFully!"})
})]

exports.login = [
    body("UsernameOrEmail" , "Required to input Username.").trim().isLength({min:1}).escape(),
    body("Passowrd" , "Required to input password.").trim().isLength({min:1}).escape(),
    asyncHandler(async(req,res,next)=>{
        if(!errors.isEmpty())
            {
                return res.status(403).json(
                    {
                        username : req.body.username,
                        errors : errors.array()
                    })
            }
    const user = await User.findOne($or[{Username:req.body.Username} , {Email:req.body.Email}]).exec()
    if(!user){
        return res.status(400).json({message:"Invalid Username Or Password!"})
    }
    const passwordMatch = bcrypt.compare(req.body.Password , user.Password)
    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
    }
    const body = {
        _id: user._id,
        Username: user.Username,
        Email: user.Email
    };
    const accesstoken = jwt.sign({user: {_id: user._id, username:user.Username , email:user.Email}} , process.env.JWT_SECRET , { expiresIn:'1d'})
    return res.status(200).json({message:"Logged in Successfully" , token:accesstoken , user:user})

})]
exports.logout = asyncHandler(async(req,res,next)=>{

})
exports.forgot_password = [asyncHandler(async(req,res,next)=>{

})]
exports.post_reset_password = [asyncHandler(async(req,res,next)=>{

})]
//undo till idk