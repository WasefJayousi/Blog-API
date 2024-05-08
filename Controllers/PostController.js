const Post = require("../Models/Post");
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler");
const {upload} = require("../Multer-config")

exports.Create = [
    upload.fields([
        { name: 'file', maxCount: 1 }, // PDF file
        { name: 'img', maxCount: 1 },  // Image file
        ]),
    body("PostTitle" , "Post Title must not be empty").trim().length({min:1}).escape(),
    body("PostDescription" , "Post Description must not be empty").trim().length({min:1}).escape(),
    asyncHandler(async(req,res,next)=>
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            {
                return res.status(400).json({errors:errors.array()})
            }
        if(req.body.isPublic)
            {
                isPublic = true
            }
        const newPost = new Post({
                User:req.user._id,
                img:req.files.img[0].path,
                PostTitle: req.body.PostTitle,
                PostDescription:req.body.PostDescription,
                likes:0,
                isPublic:isPublic         
        })
        await newPost.save();

        return res.status(201).json({message: "Post Created Successfuly!"})
    })

]
exports.list = asyncHandler(async(req,res,next)=>{
    const posts = await Post.find({}).sort({PostTitle:-1}).populate("User").exec();
    if(!posts){
        
        return res.status(404).json({message:"there is no posts"})
    }
    return res.status(200).json({post_list:posts})
    
})
//Details
//search
//delete