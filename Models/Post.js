const mongoose = require("mongoose");
const{DateTime} = require("../Configs/Format-date")
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    User : {type:Schema.Types.ObjectId , ref:"User" , required:true},
    img :{type:String , required:true},
    PostTitle : {type:String , minLength:1 , maxLength:30 , required:true},
    PostDescription: {type:String , minLength:10 , maxLenght:250 , required:true},
    likes : Number,
    Date : {type:Date , default:Date.now},
    isPublic : {type:Boolean , default:false}
})
// Add indexes for efficient searching
PostSchema.index({ User: 1 });
PostSchema.index({ PostTitle: 'text' }); // Text index for searching titles

PostSchema.virtual("Date_formatted").get(function() {
    return DateTime.Format(this.Date) //complete it
});
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;