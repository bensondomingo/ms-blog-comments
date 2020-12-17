var express = require('express');
var router = express.Router();

const { randomBytes } = require('crypto');
const axios = require('axios');

const commentsByPostID = require('../public/javascripts/commentsByPostIdCollections');

router
  .route('/:id/comments')
  .get((req, res) => {
    res.send(commentsByPostID[req.params.id] || []);
  })
  .post(async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostID[req.params.id] || [];
    const newComment = { id: commentId, content, status: 'PENDING' };
    comments.push(newComment);
    commentsByPostID[req.params.id] = comments;

    axios.post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: { ...newComment, postId: req.params.id },
    });

    res.status(201).send(comments);
  });

module.exports = router;
