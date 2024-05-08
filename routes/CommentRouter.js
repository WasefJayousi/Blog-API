const express = require('express');
const Comment = require('../controllers/CommentController');
const passport = require('passport');
const router = express.Router();

// Create a comment on a specific resource within a faculty
router.post('/add/:Postid/:ParrentCommentId', Comment.Add_comment);
router.put('/update/:CommentId/:ParrentCommentId' , Comment.Edit_Comment);
router.delete('/delete/:CommentId/:ParrentCommentId' , Comment.Delete_comment);

module.exports = router;
