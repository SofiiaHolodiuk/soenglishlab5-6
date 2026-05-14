const { Schema, model } = require('mongoose');

const instructorSchema = new Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    imagePath: { type: String },
  },
  { timestamps: true },
);

module.exports = model('Instructor', instructorSchema);
