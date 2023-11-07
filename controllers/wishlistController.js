const WishlistItem = require("../models/wishlistModel");

// add advetisement bill board to wishlist
const addToWishList = async (req, res) => {
  try {
    const { userId, advertisementId } = req.body;

    // Check if the item already exists in the wishlist
    const existingItem = await WishlistItem.findOne({
      userId,
      advertisementId,
    });

    if (existingItem) {
      // If the item exists, remove it from the wishlist
      await WishlistItem.findOneAndRemove({
        userId,
        advertisementId,
      });

      res
        .status(200)
        .json({ message: "Advertisement removed from wishlist successfully" });
    } else {
      // If the item doesn't exist, add it to the wishlist
      const wishlistItem = new WishlistItem({
        userId,
        advertisementId,
      });

      await wishlistItem.save();

      res
        .status(200)
        .json({ message: "Advertisement added to wishlist successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// remove board from wish list
const myWishList = async (req, res) => {
  try {
    const userId = req.params.userId;

    // retrieve data of my wishlist
    const wishlistItems = await WishlistItem.find({ userId }).populate({
      path: "advertisementId",
      // select: 'title description pricePerDay images location', // Add fields you want to include
    });

    if (!wishlistItems) {
      return res
        .status(404)
        .json({ message: "not items found in your wishlist!" });
    }

    // Extracting advertisementId data using map and destructuring
    const advertisements = wishlistItems.map(
      ({ advertisementId }) => advertisementId
    );

    // Send the advertisementData in the response
    res.status(200).json({ wishlistItems: advertisements });
  } catch (error) {}
};

module.exports = {
  addToWishList,
  myWishList,
};
