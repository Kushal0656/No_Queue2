import express from 'express';
import Queue from '../models/Queue.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';

const router = express.Router();

// Join Queue
router.post('/join', async (req, res) => {
  try {
    const { firebaseUid, shopId } = req.body;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Check if user is already in a queue
    const existingQueue = await Queue.findOne({ userId: user._id, status: 'waiting' });
    if (existingQueue) {
      return res.status(400).json({ message: "You are already in a queue" });
    }

    // Determine current queue length for token number
    const queueCount = await Queue.countDocuments({ shopId, status: 'waiting' });
    if (queueCount >= (shop.maxQueue || 20)) {
       return res.status(400).json({ message: "Queue is full" });
    }

    const tokenNumber = queueCount + 1; // Simplistic approach, could be improved with sequence
    const estimatedWaitTime = tokenNumber * 10; // 10 mins per person guess

    const newQueue = new Queue({
      shopId,
      userId: user._id,
      tokenNumber,
      estimatedWaitTime
    });

    await newQueue.save();
    
    res.status(201).json(newQueue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View Shop's Queue status for users
router.get('/status/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { firebaseUid } = req.query;

    const queueList = await Queue.find({ shopId, status: 'waiting' }).sort({ tokenNumber: 1 }).populate('userId', 'name');
    
    let userPosition = null;
    let userToken = null;

    if (firebaseUid) {
      const user = await User.findOne({ firebaseUid });
      if (user) {
        const userQ = queueList.find(q => q.userId._id.toString() === user._id.toString());
        if (userQ) {
          userToken = userQ.tokenNumber;
          userPosition = queueList.findIndex(q => q.userId._id.toString() === user._id.toString()) + 1;
        }
      }
    }

    res.json({
      currentServingToken: queueList.length > 0 ? queueList[0].tokenNumber : null,
      totalWaiting: queueList.length,
      userToken,
      userPosition,
      queueList: queueList // For admin to see
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Call Next Customer
router.post('/call-next', async (req, res) => {
  try {
    const { shopId, adminFirebaseUid } = req.body;
    
    // Optional: verification that the caller is indeed the shop admin
    const admin = await User.findOne({ firebaseUid: adminFirebaseUid });
    const shop = await Shop.findOne({ _id: shopId, adminId: admin?._id });
    
    if (!shop) {
      return res.status(403).json({ message: "Unauthorized to manage this shop's queue." });
    }

    // Find current customer
    const currentCustomer = await Queue.findOne({ shopId, status: 'waiting' }).sort({ tokenNumber: 1 });
    
    if (!currentCustomer) {
      return res.status(400).json({ message: "No one is in the queue." });
    }

    currentCustomer.status = 'served';
    await currentCustomer.save();

    res.json({ message: "Customer served", servedCustomer: currentCustomer });

  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's active queue
router.get('/user-active/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const activeQueue = await Queue.findOne({ userId: user._id, status: 'waiting' });
    if (!activeQueue) {
      return res.status(404).json({ message: "No active queue" });
    }
    
    res.json(activeQueue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave Queue
router.post('/leave', async (req, res) => {
  try {
    const { firebaseUid, shopId } = req.body;
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const activeQueue = await Queue.findOne({ userId: user._id, shopId, status: 'waiting' });
    if (activeQueue) {
      activeQueue.status = 'cancelled';
      await activeQueue.save();
    }
    res.json({ message: "Left queue successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
