const { Schema, model } = require('mongoose');

const subscriberSchema = new Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = model('Subscriber', subscriberSchema);
