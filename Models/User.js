const mongoose = require('mongoose');
const{DateTime} = require("../Format-date")
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: { type: String, required: true, maxLength: 12 , unique: true },
  Email: { type: String, required: true, maxLength: 256, minLength: 15, unique: true },
  Password: { type: String, required: true, maxLength: 256, minLength: 8 },
  isAdmin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});
userSchema.virtual("Date_formatted").get(function() {
return DateTime.Format(this.created_at) //complete it
});
const User = mongoose.model('User', userSchema);

module.exports = User;
