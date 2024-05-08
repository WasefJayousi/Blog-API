require('dotenv').config();
const mongoose = require("mongoose");
const User = require("./Models/User"); 
const Post  = require("./Models/Post");
const Comment = require("./Models/Comment");

const MongoDBurl = process.env.MongoDB_URL
// Connect to MongoDB (replace with your actual MongoDB URL)
mongoose.connect(MongoDBurl);



async function initSchemasToDatabase() {
    console.log("trying to insert , if closed then created")
  try {
      const newUser = new User({ 
        Username: "Wasef",
        Email: "Random@gmail.com",
        Password: "Encrypted",
        isAdmin: false,    
    });
    await newUser.save();

    const newPost = new Post({
        User : newUser._id,
        img : "random image file location",
        PostTitle : "random title" ,
        PostDescription: "some description in this bulls",
        likes : 1,
        isPublic :true
    })
      await newPost.save();
    const newComment = new Comment({
    User : newUser._id,
    Post : newPost._id,
    Text : "hello world!",
    })
      await newComment.save();
    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error inserting User :", error);
  }
}

// Call the function to insert User 
initSchemasToDatabase();