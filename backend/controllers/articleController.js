const Article = require('../models/Article');
const User = require('../models/User');
const generateSlug = require('../utils/generateSlug');

exports.createArticle = async (req, res) => {
  console.log("Decoded user:", req.user);
  console.log("Request body:", req.body);

  try {
    const { title, content, category, summary, thumbnail, tags } = req.body;
    
    if (!title || !content || !category || !summary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const slug = generateSlug(title);

    // Check if slug already exists
    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Title already used' });
    }

    const article = new Article({
      title,
      slug,
      content,
      category,
      summary,
      thumbnail,
      tags,
      author: req.user.id 
    });

    await article.save();

    res.status(201).json({ message: 'Article created', article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, summary, thumbnail, tags } = req.body;

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Only author or admin can update
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (title) {
      article.title = title;
      article.slug = generateSlug(title);
    }
    if (content) article.content = content;
    if (category) article.category = category;
    if (summary) article.summary = summary;
    if (thumbnail) article.thumbnail = thumbnail;
    if (tags) article.tags = tags;

    await article.save();
    res.json(article);
  } catch (err) {
    console.log(err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get article by slug + populate author
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ slug })
      .populate('author', 'username role');

    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get article by ID + populate author
const mongoose = require('mongoose');

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await Article.findById(id)
      .populate('author', 'username role');

    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// List articles with filters, pagination
exports.listArticles = async (req, res) => {
  try {
    let { page = 1, limit = 1000, category, sortBy } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (category) filter.category = category;

    let query = Article.find(filter).populate('author', 'username');

    // Sorting options
    if (sortBy === 'topVote') {
      // Sort by (up votes - down votes) desc
      query = query.sort({ 'votes.up.length': -1, 'votes.down.length': 1, createdAt: -1 });
    } else if (sortBy === 'controversial') {
      // Sort by sum of votes (up + down) desc
      query = query.sort({ 'votes.up.length': -1, 'votes.down.length': -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const total = await Article.countDocuments(filter);
    const articles = await query.skip((page - 1) * limit).limit(limit);

    res.json({ total, page, limit, articles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/articles/category
exports.listArticlesByCategory = async (req, res) => {
  try {
    let { page = 1, limit = 1000, category, sortBy = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (category) {
      filter.category = category;
    }

    let query = Article.find(filter).populate('category');

    if (sortBy === 'topVote') {
      query = query.sort({ 'votes.up.length': -1, 'votes.down.length': 1, createdAt: -1 });
    } else if (sortBy === 'controversial') {
      // Không thể dùng $expr trong sort() => cần chuyển sang aggregate hoặc tính ở frontend
      query = query.sort({ createdAt: -1 }); // fallback
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const total = await Article.countDocuments(filter);
    const articles = await query.skip((page - 1) * limit).limit(limit);

    res.json({ total, page, limit, articles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// List articles by current logged-in author
exports.listArticlesByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    let { page = 1, limit = 1000, category, sortBy } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { author: id }; // 👈 Lọc theo tác giả hiện tại

    if (category) filter.category = category;

    let query = Article.find(filter).populate('author', 'username');

    // Sorting options
    if (sortBy === 'topVote') {
      query = query.sort({
        'votes.up.length': -1,
        'votes.down.length': 1,
        createdAt: -1,
      });
    } else if (sortBy === 'controversial') {
      query = query.sort({
        'votes.up.length': -1,
        'votes.down.length': -1,
        createdAt: -1,
      });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const total = await Article.countDocuments(filter);
    const articles = await query.skip((page - 1) * limit).limit(limit);

    res.json({ total, page, limit, articles });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Vote up/down logic
exports.voteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const { type } = req.body; // 'up' hoặc 'down'
    const userId = req.user.id;

    const article = await Article.findById(articleId);
    const user = await User.findById(userId);

    if (!article || !user) {
      return res.status(404).json({ message: 'Article or user not found' });
    }

    // Nếu chưa có, khởi tạo mảng
    if (!user.upvotedArticles) user.upvotedArticles = [];

    // Xoá vote cũ
    article.votes.up = article.votes.up.filter(v => !v.userId.equals(userId));
    user.upvotedArticles = user.upvotedArticles.filter(aid => !aid.equals(articleId));

    // Thêm vote nếu type là 'up'
    if (type === 'up') {
      article.votes.up.push({ userId });
      user.upvotedArticles.push(articleId);
    }

    await article.save();
    await user.save();

    res.json({
      message: 'Voted successfully',
      articleVotes: article.votes,
      updatedUser: {
        _id: user._id,
        upvotedArticles: user.upvotedArticles,
      },
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error during voting' });
  }
};

// controllers/ArticleController.js
exports.getLikedArticles = async (req, res) => {
  try {
    const { articleIds } = req.body;

    if (!articleIds || !Array.isArray(articleIds)) {
      return res.status(400).json({ message: 'Invalid articleIds' });
    }

    const articles = await Article.find({
      _id: { $in: articleIds }
    }).select('-content'); // nếu không cần nội dung chi tiết

    res.json({ articles });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
