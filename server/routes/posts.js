const express = require('express');
const middleware = require('../middlewares/auth');
const post = require('../controllers/posts');

const router = express.Router();

//create
router.post('/', middleware.verifyToken, post.postControllers.createPost);

//read
router.get('/', middleware.verifyToken, post.postControllers.getFeedPosts);
router.get('/:id/posts', middleware.verifyToken, post.postControllers.getUserPosts);

//update
router.patch('/:id/like', middleware.verifyToken, post.postControllers.likePost);
router.patch('/:id/comment', middleware.verifyToken, post.postControllers.addComment);

//delete
router.patch('/:id/delete', middleware.verifyToken, post.postControllers.deletePost);

exports.default = router;