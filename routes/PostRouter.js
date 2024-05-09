const express = require('express');
const Post = require('../Controllers/PostController');
const passport = require('passport');
const router = express.Router();


// passport.authenticate() required for all routes / do it later

router.post("/Create-post" ,Post.Create-Post )

router.get("/post-lists" ,Post.list )

router.get("/post-details/:id" ,Post.Details)

router.get("/search/:id" , Post.Search)

router.post('/posts/:postId/like', Post.Incrementlikes);

router.delete("/Delete-post:id" ,Post.Delete )