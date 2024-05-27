const mongoose = require('mongoose');
const{DateTime} = require("../Configs/Format-date")
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: { type: String, required: true,minLength: 3, maxLength: 100 , unique: true },
  Email: { type: String, required: true, minLength: 5 , maxLength: 256 , unique: true },
  Password: { type: String, required: true, minLength: 8 , maxLength: 256 },
  created_at: { type: Date, default: Date.now },
  isVerified : {type:Boolean , default:false},
});
userSchema.virtual("Date_formatted").get(function() {
return DateTime.Format(this.created_at) //complete it
});
const User = mongoose.model('User', userSchema);

module.exports = User;
