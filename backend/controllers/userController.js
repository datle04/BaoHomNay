const User = require('../models/User');
const Article = require('../models/Article');

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'editor', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUpvotedArticles = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy user cùng danh sách bài viết đã upvote
    const user = await User.findById(userId).populate({
      path: 'upvotedArticles',
      populate: { path: 'author', select: 'username' } // optional
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ articles: user.upvotedArticles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};