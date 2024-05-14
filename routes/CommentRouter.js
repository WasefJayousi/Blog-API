const express = require('express');
const Comment = require('../controllers/CommentController');
const passport = require('passport');
const router = express.Router();

// passport.authenticate() required for all routes / do it later
router.post('/add/:Postid/:ParrentCommentId',passport.authenticate('jwt', { session: false }), Comment.Add_comment);
router.put('/update/:CommentId/:ParrentCommentId' ,passport.authenticate('jwt', { session: false }), Comment.Edit_Comment);
router.delete('/delete/:CommentId/:ParrentCommentId' ,passport.authenticate('jwt', { session: false }), Comment.Delete_comment);

module.exports = router;
