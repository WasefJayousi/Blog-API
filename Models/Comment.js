const mongoose = require("mongoose");
const{DateTime} = require("../Configs/Format-date")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    User : {type: Schema.Types.ObjectId  , ref:"User" , required : true},
    Post : {type:Schema.Types.ObjectId , ref:"Post" , required:true},
    Text : {type:String , required:true , minLength : 3 , maxLength : 100},
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment' // References the Comment model itself
    }],
    ParentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment' // References the Comment model itself
    },
    Created_At: {type:Date , default:Date.now},

})
commentSchema.virtual("Date_formatted").get(function() {
    return DateTime.Format(this.Created_At) //complete it
});

module.exports = mongoose.model("Comment" , commentSchema)