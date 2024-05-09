const Comment = require("../Models/Comment")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler")

exports.Add_comment = [
    body("text" , "Required Text to post").trim().isLength({min:1}).escape(),
    asyncHandler(async(req,res,next)=>
    {
        const errors  = validationResult(req)
        const {text} = req.body
        const PostID = req.params.Postid
        const ParrentCommentID = req.params.ParrentCommentId

        if(!errors.isEmpty())
            {
                return res.json(403).json({
                    errors : errors.array()
                })
     
            }
        if(ParrentCommentID.isEmpty()){
            const newComment = new Comment({
                User:req.user._id,
                Post:PostID,
                Text: text,
            })
            await newComment.save();
        }
        else
        {
            const reply = new Comment({
                User:req.user._id,
                Post:PostID,
                Text: text,
                ParentComment:ParrentCommentID
            })
            const parentComment = await Comment.findById(ParrentCommentID).exec();
            parentComment.replies.push(reply._id);
            await parentComment.save();
        }
        return res.status(201).json({ message: 'Comment created successfully' });

    }
)
]

exports.Edit_Comment = [
    body("New Comment" , "Required text to update").trim().isLength({min:1}).escape(),
    asyncHandler(async(req,res,next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    
    const commentID = req.params.CommentId
    const ParrentCommentID = req.params.ParrentCommentId
    const {NewComment} = req.body
        // Find the comment by ID
    const comment = await Comment.findById(commentID).exec();

    if (!comment) {
        console.log(`Comment with ID ${commentId} not found.`);
        return res.status(404).json({ message: "Comment not found" });
    }
        // Check if the user making the request matches the user ID associated with the comment
    if (comment.User._id.toString() !== req.user._id.toString()) {
        console.log(`User ${req.user._id} is unauthorized to update comment ${commentId}.`);
        return res.status(403).json({ message: "Unauthorized to Update this Comment" });
    }
    
    const UpdatedComment = await Comment.findByIdAndUpdate(
        commentID,
        {Comment:NewComment},
        {new:true}
    ).exec()
        
    if (UpdatedComment) {
        console.log(`Comment with ID ${commentID} updated successfully.`);
        return res.status(200).json({ message: "Comment Updated successfully", updatedComment });
    } else {
        console.log(`Failed to update comment with ID ${commentID}.`);
        return res.status(500).json({ message: "Failed to update comment" });
        }})

]

exports.Delete_comment = asyncHandler(async(req,res,next)=>
{
    const {PostID , CommentID} = req.params
    const comment = await Comment.findOne({_id:CommentID}).exec()
    if(!comment)
    {
        return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.User._id.toString() === req.user._id.toString()) {
        await Comment.findByIdAndDelete(comment._id);
        return res.status(200).json({ message: "Comment deleted successfully" });
      }
})
