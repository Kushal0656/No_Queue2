import express from "express";
import Shop from "../models/Shop.js";

const router = express.Router();



/* Create Shop */
router.post("/create-shop", async (req, res) => {
  try {
    const { firebaseUid, shopName, shopId, address, maxCapacity } = req.body;
    
    // Find the user by firebaseUid to set as admin
    const user = await req.app.locals.User ? req.app.locals.User.findOne({ firebaseUid }) : await import('../models/User.js').then(m => m.default.findOne({ firebaseUid }));
    
    if (!user) {
      return res.status(404).json({ message: "User not found to associate as Shop Admin." });
    }

    const newShop = new Shop({
      adminId: user._id,
      shopName,
      shopId,
      address,
      maxQueue: maxCapacity || 20
    });

    await newShop.save();

    // Optionally update user role to admin
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



/* Get All Shops */
router.get("/shops", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Get Admin's Shops */
router.get("/shops/admin/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await req.app.locals.User ? req.app.locals.User.findOne({ firebaseUid }) : await import('../models/User.js').then(m => m.default.findOne({ firebaseUid }));
    
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const shops = await Shop.find({ adminId: user._id });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;