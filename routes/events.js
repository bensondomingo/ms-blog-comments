const express = require('express');
const router = express.Router();

const axios = require('axios');

const commentsByPostID = require('../public/javascripts/commentsByPostIdCollections');

router.post('/', (req, res) => {
  const event = req.body;

  if (event.type === 'CommentModerated') {
    // update comment in in-memory database
    const { id, status, postId } = event.data;
    // get a reference to the comment object from the array of
    // comments then update it
    const comment = commentsByPostID[postId].find((c) => c.id === id);
    comment.status = status;

    // emit CommentUpdated event
    axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: event.data,
    });
  }

  res.send({ status: 'OK' });
});

module.exports = router;
