const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { articleId, content } = req.body;
    if (!articleId || !content) return res.status(400).json({ message: 'Missing fields' });

    const comment = new Comment({
      articleId,
      userId: req.user.id,
      content,
    });

    await comment.save();
    res.status(201).json({ message: 'Comment created', comment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
