const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageId: String,
  harga: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('CaseHp', productSchema);
