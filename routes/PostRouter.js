const express = require('express');
const Post = require('../Controllers/PostController');
const passport = require('passport');
const router = express.Router();


// passport.authenticate() 

router.post("/Create-post" ,passport.authenticate('jwt', { session: false }),Post.Create )

router.get("/post-lists" ,Post.list )

router.get("/post-details/:id" ,Post.Details)

router.get("/search/:id" , Post.Search)

router.post('/posts/:postId/like', passport.authenticate('jwt', { session: false }),Post.Incrementlikes);

router.delete("/Delete-post:id" ,passport.authenticate('jwt', { session: false }),Post.Delete )

module.exports = router;