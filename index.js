require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI; // MongoDB connection URI from environment variables

// Create a new MongoClient with the URI and options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Ensure database connection is established
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

// API route for users
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

// API route for components
app.get('/api/component', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');
    const componentData = await componentCollection.find().toArray();
    res.json(componentData);
  } catch (error) {
    console.error('Error retrieving component data:', error);
    res.status(500).json({ message: 'Error retrieving component data' });
  }
});

// Export the app for Vercel
module.exports = app;