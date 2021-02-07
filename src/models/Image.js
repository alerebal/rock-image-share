const { strict } = require('assert');
const { Schema, model } = require('mongoose');
const path = require('path');

const ImageSchema = new Schema({
  userId: String,
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  imageUrl: String,
  public_id: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

ImageSchema.virtual('uniqueId')
  .get(function () {
    return this.filename;;
  });

module.exports = model('Image', ImageSchema);
