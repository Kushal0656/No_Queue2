import User from '../models/User.js';

export const syncUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role } = req.body;
    
    if (!firebaseUid || !email) {
      return res.status(400).json({ error: 'Missing required user fields' });
    }

    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      // Create new user
      user = new User({
        firebaseUid,
        name: name || 'Anonymous User',
        email,
        role: role || 'customer'
      });
      await user.save();
    }
    
    res.status(200).json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
