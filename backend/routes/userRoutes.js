const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const roleCheck = require('../middlewares/roleCheck');

router.patch('/:id/role', verifyToken, roleCheck(['admin']), userController.updateRole);
router.get('/:userId/upvoted-articles', userController.getUpvotedArticles);

module.exports = router;
