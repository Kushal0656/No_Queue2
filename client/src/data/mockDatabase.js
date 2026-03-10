import { useState, useEffect } from 'react';

// Simulated initial database state
const INITIAL_SHOPS = [
  { 
    id: 'RB1023', 
    name: 'Raj Barber Shop', 
    category: 'Salon',
    location: 'Ambattur, Chennai', 
    address: '21 Gandhi Street\nAmbattur, Chennai\nTamil Nadu – 600053',
    rating: 4.6, 
    reviews: 128,
    avgTimePerPerson: 7,
    openTime: '09:00 AM - 09:00 PM',
  },
  { 
    id: 'SC2041', 
    name: 'City Service Center', 
    category: 'Auto',
    location: 'Anna Nagar, Chennai', 
    address: '45 Blue Ave\nAnna Nagar, Chennai\nTamil Nadu - 600040',
    rating: 4.8, 
    reviews: 342,
    avgTimePerPerson: 25,
    openTime: '08:00 AM - 06:00 PM',
  },
  { 
    id: 'DC3055', 
    name: 'Smile Dental Clinic', 
    category: 'Clinic',
    location: 'T Nagar, Chennai', 
    address: '88 Star Road\nT Nagar, Chennai\nTamil Nadu - 600017',
    rating: 4.9, 
    reviews: 89,
    avgTimePerPerson: 15,
    openTime: '10:00 AM - 08:00 PM',
  },
  { 
    id: 'SS4089', 
    name: 'Style Spa & Salon', 
    category: 'Salon',
    location: 'Velachery, Chennai', 
    address: '12 Mall Link\nVelachery, Chennai\nTamil Nadu - 600042',
    rating: 4.5, 
    reviews: 210,
    avgTimePerPerson: 30,
    openTime: '11:00 AM - 09:00 PM',
  },
  {
    id: 'TR5011',
    name: 'Taste Restaurant',
    category: 'Food',
    location: 'Adyar, Chennai',
    address: '15 Main Road\nAdyar, Chennai\nTamil Nadu - 600020',
    rating: 4.3,
    reviews: 560,
    avgTimePerPerson: 45,
    openTime: '12:00 PM - 11:00 PM'
  }
];

// In-memory store (simulating a database)
// In a real app, this would be in Firebase Firestore or similar
let shopsDB = [...INITIAL_SHOPS];

// Queues maps shopId -> array of queue entries
// Entry format: { userId, userName, token, status: 'waiting'|'serving'|'completed', joinedAt: timestamp }
let queuesDB = {
  'RB1023': [
    { userId: 'mock-user-1', userName: 'John D.', token: 1, status: 'waiting', joinedAt: Date.now() - 1000 * 60 * 10 },
    { userId: 'mock-user-2', userName: 'Sarah K.', token: 2, status: 'waiting', joinedAt: Date.now() - 1000 * 60 * 5 }
  ],
  'DC3055': [
    { userId: 'mock-user-3', userName: 'Mike T.', token: 1, status: 'serving', joinedAt: Date.now() - 1000 * 60 * 20 }
  ]
};

// Counters to keep track of the next token string for each shop
let tokenCounters = {
  'RB1023': 3,
  'SC2041': 1,
  'DC3055': 2,
  'SS4089': 1,
  'TR5011': 1
};

// Singleton pattern for the mock DB client
export const db = {
  getShops: async () => {
    // calculate dynamic queue size for each shop before returning
    return shopsDB.map(shop => ({
      ...shop,
      queueSize: (queuesDB[shop.id] || []).filter(q => q.status === 'waiting').length,
    }));
  },

  getShopById: async (id) => {
    const shop = shopsDB.find(s => s.id === id);
    if (!shop) throw new Error('Shop not found');
    
    const queue = queuesDB[id] || [];
    const waitingQueue = queue.filter(q => q.status === 'waiting');
    const serving = queue.find(q => q.status === 'serving');
    
    return {
      ...shop,
      queueSize: waitingQueue.length,
      currentToken: serving ? serving.token : (waitingQueue.length > 0 ? waitingQueue[0].token : '--')
    };
  },

  joinQueue: async (shopId, user) => {
    if (!user || (!user.uid && !user.userId)) throw new Error('Must be logged in to join queue');
    if (!queuesDB[shopId]) queuesDB[shopId] = [];
    
    // Check if user is already in any active queue (business rule: 1 active queue at a time)
    // We'll skip this strict check for mock purposes, but normally we'd enforce it.
    
    const token = tokenCounters[shopId]++;
    const newEntry = {
      userId: user.uid || user.userId,
      userName: user.displayName || 'Anonymous User',
      token,
      status: 'waiting',
      joinedAt: Date.now()
    };
    
    queuesDB[shopId].push(newEntry);
    return newEntry;
  },

  getUserActiveQueue: async (userId) => {
    if (!userId) return null;
    
    for (const shopId of Object.keys(queuesDB)) {
      const queue = queuesDB[shopId];
      const userEntry = queue.find(q => q.userId === userId && (q.status === 'waiting' || q.status === 'serving'));
      
      if (userEntry) {
        const shop = shopsDB.find(s => s.id === shopId);
        
        // Calculate position
        const waitingQueue = queue.filter(q => q.status === 'waiting').sort((a,b) => a.token - b.token);
        const position = userEntry.status === 'serving' ? 0 : waitingQueue.findIndex(q => q.userId === userId) + 1;
        
        const serving = queue.find(q => q.status === 'serving');
        
        return {
          shop,
          entry: userEntry,
          position,
          currentToken: serving ? serving.token : (waitingQueue.length > 0 ? waitingQueue[0].token : '--'),
          estimatedWait: position * shop.avgTimePerPerson
        };
      }
    }
    return null;
  },

  leaveQueue: async (shopId, userId) => {
    if (!queuesDB[shopId]) return;
    const queue = queuesDB[shopId];
    const index = queue.findIndex(q => q.userId === userId && (q.status === 'waiting'));
    if (index !== -1) {
      queue.splice(index, 1);
    }
  },

  // Admin Functions
  getShopQueueAsAdmin: async (shopId) => {
    if (!queuesDB[shopId]) return [];
    return queuesDB[shopId].filter(q => q.status !== 'completed').sort((a,b) => a.token - b.token);
  },

  callNextToken: async (shopId) => {
    if (!queuesDB[shopId]) return null;
    
    const queue = queuesDB[shopId];
    
    // Complete current serving if any
    const currentlyServing = queue.find(q => q.status === 'serving');
    if (currentlyServing) {
      currentlyServing.status = 'completed';
    }
    
    // Find next waiting
    const waiting = queue.filter(q => q.status === 'waiting').sort((a,b) => a.token - b.token);
    if (waiting.length > 0) {
      waiting[0].status = 'serving';
      return waiting[0];
    }
    return null;
  },
  
  markServiceComplete: async (shopId) => {
    if (!queuesDB[shopId]) return;
    const queue = queuesDB[shopId];
    const currentlyServing = queue.find(q => q.status === 'serving');
    if (currentlyServing) {
      currentlyServing.status = 'completed';
    }
  },

  resetQueue: async (shopId) => {
    queuesDB[shopId] = [];
    tokenCounters[shopId] = 1;
  }
};
