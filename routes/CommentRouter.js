const express = require('express');
const Comment = require('../Controllers/CommentController');
const passport = require('passport');
const router = express.Router();

// passport.authenticate() required for all routes / do it later
router.post('/add/:Postid',passport.authenticate('jwt', { session: false }), Comment.Add_comment);
router.post('/reply/:Postid/:ParrentCommentId',passport.authenticate('jwt', { session: false }), Comment.ReplyToComment);
router.put('/update/:CommentId' ,passport.authenticate('jwt', { session: false }), Comment.Edit_Comment);
router.delete('/delete/:CommentId' ,passport.authenticate('jwt', { session: false }), Comment.Delete_comment);

module.exports = router;
