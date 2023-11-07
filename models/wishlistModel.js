const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  advertisementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertisement',
    required: true,
  },
});

const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

module.exports = WishlistItem;