const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/:articleId', commentController.getCommentsByArticle);
router.post('/', verifyToken, commentController.createComment);
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;
