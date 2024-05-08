const express = require('express');
const Post = require('../Controllers/PostController');
const passport = require('passport');
const router = express.Router();

router.post("/Create-post" ,Post.Create-Post )

router.get("/post-lists" ,Post.list )

router.get("/post-details/:id" ,Post.Details)
router.get("/search/:id" , Post.Search)

router.post('/posts/:postId/like', Post.Increment-likes);

router.delete("/Delete-post" ,Post.delete )