const mongoose = require("mongoose");
const{DateTime} = require("../Format-date")
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    User : {type:Schema.Types.ObjectId , ref:"User" , required:true},
    img :{type:String , required:true},
    PostTitle : {type:String , required:true , minLength:1 , maxLength:30},
    PostDescription: {type:String , required:true , min:10 , maxLenght:250},
    likes : Number,
    Date : {type:Date , default:Date.now},
    isPublic : {type:Boolean , default:false}
})

PostSchema.virtual("Date_formatted").get(function() {
    return DateTime.Format(this.Date) //complete it
});
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;