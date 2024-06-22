const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  title: { type: String, required: true },
  content: { type: String, required: true },
  code: { type: String },
  lang: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Topic', TopicSchema);
