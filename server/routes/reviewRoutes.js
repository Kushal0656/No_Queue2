import express from 'express';
import Review from '../models/Review.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';

const router = express.Router();

// Add Review
router.post('/add', async (req, res) => {
  try {
    const { firebaseUid, shopId, rating, comment } = req.body;
    
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const newReview = new Review({
      shopId,
      userId: user._id,
      rating,
      comment
    });

    await newReview.save();

    // Update shop rating avg
    const allReviews = await Review.find({ shopId });
    const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalRating / allReviews.length;

    shop.rating = avgRating.toFixed(1);
    shop.totalReviews = allReviews.length;
    await shop.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Reviews for Shop
router.get('/:shopId', async (req, res) => {
  try {
    const reviews = await Review.find({ shopId: req.params.shopId }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
