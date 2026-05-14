const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  tag:          { type: String, default: 'Creative' },
  lessonCount:  { type: Number, default: 12 },
  rating:       { type: Number, default: 4.9 },
  imagePath:    { type: String },
}, { timestamps: true });

module.exports = model('Course', courseSchema);
