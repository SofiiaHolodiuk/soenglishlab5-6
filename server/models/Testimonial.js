const { Schema, model } = require('mongoose');

const testimonialSchema = new Schema({
  author:    { type: String, required: true },
  text:      { type: String, required: true },
  imagePath: { type: String },
}, { timestamps: true });

module.exports = model('Testimonial', testimonialSchema);
