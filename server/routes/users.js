const express = require('express');
const user = require('../controllers/users')

const middleware = require('../middlewares/auth');

const router = express.Router();

//read
router.get('/:id', middleware.verifyToken, user.userControllers.getUser);
router.get('/:id/friends', middleware.verifyToken, user.userControllers.getUserFriends);

//update
router.patch('/:id/:friendId', middleware.verifyToken, user.userControllers.addRemoveFriend);
router.patch('/upload', middleware.verifyToken, user.userControllers.uploadPhoto);
// router.patch('/delete', middleware.verifyToken, user.userControllers.deleteUser);

exports.default = router;