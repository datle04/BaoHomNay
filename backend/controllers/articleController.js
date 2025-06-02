const Article = require('../models/Article');
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
    let { page = 1, limit = 10, category, sortBy } = req.query;
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

// Vote up/down logic
exports.voteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Remove user from both votes first
    article.votes.up = article.votes.up.filter(v => v.userId.toString() !== req.user.id);
    article.votes.down = article.votes.down.filter(v => v.userId.toString() !== req.user.id);

    // Add to voteType array
    article.votes[voteType].push({ userId: req.user.id });

    await article.save();
    res.json({ message: `Voted ${voteType}`, votes: article.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
