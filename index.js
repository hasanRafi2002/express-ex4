// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const uri = process.env.MONGO_URI; // MongoDB connection URI from environment variables

// // Create a new MongoClient with the URI and options
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // Ensure database connection is established
// let isConnected = false;

// // Function to connect to MongoDB
// async function connectToDatabase() {
//   if (isConnected) return client;

//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     isConnected = true;
//     return client;
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error);
//     throw error;
//   }
// }

// // API route for users
// app.get('/api/users-2', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');
//     const users = await userCollection.find().toArray();
//     res.json(users);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ message: 'Error retrieving users' });
//   }
// });

// // API route for components
// app.get('/api/component', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');
//     const componentData = await componentCollection.find().toArray();
//     res.json(componentData);
//   } catch (error) {
//     console.error('Error retrieving component data:', error);
//     res.status(500).json({ message: 'Error retrieving component data' });
//   }
// });

// // Export the app for Vercel
// module.exports = app;




const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

// Function to connect to MongoDB
async function connectToDatabase() {
  if (isConnected) return client;
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    isConnected = true;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// GET Users
app.get('/api/users-2', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    const users = await userCollection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// POST User
app.post('/api/users-2', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    
    // Validate request body
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const newUser = { name, email, age };
    const result = await userCollection.insertOne(newUser);
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...newUser, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// PUT (Update) User
app.put('/api/users-2/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    
    const userId = new ObjectId(req.params.id);
    const { name, email, age } = req.body;
    
    // Validate input
    if (!name && !email && !age) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age) updateData.age = age;

    const result = await userCollection.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE User
app.delete('/api/users-2/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    
    const userId = new ObjectId(req.params.id);
    
    const result = await userCollection.deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// GET Components
app.get('/api/components', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');
    const components = await componentCollection.find().toArray();
    res.json(components);
  } catch (error) {
    console.error('Error retrieving components:', error);
    res.status(500).json({ message: 'Error retrieving components' });
  }
});

// POST Component
app.post('/api/components', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');
    
    // Validate request body
    const { name, type, description } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const newComponent = { name, type, description };
    const result = await componentCollection.insertOne(newComponent);
    
    res.status(201).json({
      message: 'Component created successfully',
      component: { ...newComponent, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ message: 'Error creating component' });
  }
});

// PUT (Update) Component
app.put('/api/components/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');
    
    const componentId = new ObjectId(req.params.id);
    const { name, type, description } = req.body;
    
    // Validate input
    if (!name && !type && !description) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (description) updateData.description = description;

    const result = await componentCollection.updateOne(
      { _id: componentId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json({ 
      message: 'Component updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ message: 'Error updating component' });
  }
});

// DELETE Component
app.delete('/api/components/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');
    
    const componentId = new ObjectId(req.params.id);
    
    const result = await componentCollection.deleteOne({ _id: componentId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json({ 
      message: 'Component deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ message: 'Error deleting component' });
  }
});

// Export the app for Vercel
module.exports = app;