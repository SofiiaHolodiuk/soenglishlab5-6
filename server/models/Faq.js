const { Schema, model } = require('mongoose');

const faqSchema = new Schema({
  question:  { type: String, required: true },
  answer:    { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = model('Faq', faqSchema);
