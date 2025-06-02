const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true },
  content:    { type: String, required: true }, // HTML or markdown long form
  summary:    { type: String, required: true},
  thumbnail:  { type: String, required: false},
  category:   { type: String, required: true },
  tags:       [String],
  published:  Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: {
    up:   [voteSchema],
    down: [voteSchema],
  },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
