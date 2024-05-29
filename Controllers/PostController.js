const Post = require("../Models/Post");
const Comment = require("../Models/Comment");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler");
const {upload} = require("../Configs/Multer-config")
const {clearKey} = require("../Configs/cache-redis")
const fsPromises = require("fs").promises
const path = require("path");

exports.Create = [
    upload.fields([
        { name: 'img', maxCount: 1 },  // Image file
        ]),
    body("PostTitle" , "Post Title must not be empty").trim().isLength({min:1}).escape(),
    body("PostDescription" , "Post Description must not be empty").trim().isLength({min:1}).escape(),
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
        clearKey(Post.collection.collectionName)
        return res.status(201).json({message: "Post Created Successfuly!"})
    })

]
exports.list = asyncHandler(async(req,res,next)=>{
    const posts = await Post.find({isPublic:true}).sort({PostTitle:-1}).populate("User").exec();
    if(!posts){
        
        return res.status(404).json({message:"there is no posts"})
    }
    return res.status(200).json({post_list:posts})
    
})

exports.Details = asyncHandler(async(req,res,next)=>{
    const PostId = req.params.id;
    const Comments = await Comment.find({Post:PostId}).populate("User").populate({path:'replies',populate:{path:'User'}}).exec();
    const PostDetails = await Post.findById(PostId).populate("User").exec()
    if(!Comments){Comments = "Empty"}
    if(!PostDetails)
        {
            return res.status(404).json({message:"Post not Found!"})
        }
    return res.status(200).json({PostDetails:PostDetails , Comments: Comments})
})

exports.Search = asyncHandler(async(req,res,next)=>{
    const Term = req.query.text.trim();
    const PostId = req.params.id
    let SearchedUser = await User.find({Username: new RegExp(Term,'i')}).exec()
    const SearchResult = await Post.find({
        $and:[ 
            {isPublic:true},
            {   
        $or: [
            {PostTitle:  new RegExp( Term, 'i')}, //Case-Insensitive
            {User: SearchedUser}
        ]}]     
    }).cache().exec()
    if(SearchResult.length === 0 ){
        return res.status(404).json({message:"Post Was not found!"})
    }
    return res.status(200).json({Search:SearchResult})
})

exports.Incrementlikes = asyncHandler(async(req,res,next)=>
{
    const Incrementpost = await Post.findById(req.params.postId).exec()

    if(!Incrementpost)
        {
            return res.status(404).json({message:"deleted or not found!"})
        }
        Incrementpost.likes += 1
    await Incrementpost.save()

    return res.status(200).json({message:`likes incremented on ${Incrementpost._id}`})
    //implement if the user already liked this
})//decrement likes as well implementation

exports.Delete = asyncHandler(async(req,res,next)=>{
    const DeletePost = await Post.findOne({_id:req.params.id}).exec()
    if(!DeletePost){
        return res.status(404).json({message:"Deleted or not found"})
    }
    if(req.user._id.toString() == DeletePost.User._id.toString()){
        await fsPromises.unlink(DeletePost.img) // deleting the file
        await Comment.deleteMany({Post:DeletePost._id}).exec();
        const result = await Post.deleteOne({_id: DeletePost._id}).exec()
        
        if(result.deletedCount > 0){

            return res.status(200).json({message:"Post Deleted Successfully"})
        }       
        else{
            return res.status(500).json({message:"Failed to Delete Post"})
        }
    }
    return res.status(403).json({message:"Unauthorized to Delete post"})
})