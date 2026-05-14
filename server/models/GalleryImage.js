const { Schema, model } = require('mongoose');

const galleryImageSchema = new Schema({
  imagePath:  { type: String, required: true },
  altText:    { type: String },
  sortOrder:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = model('GalleryImage', galleryImageSchema);
