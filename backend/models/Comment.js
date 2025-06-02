const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  content:   { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
