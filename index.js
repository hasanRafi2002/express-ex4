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

// Load and insert data from component.json into MongoDB
async function loadDataToDatabase() {
  const dataFilePath = path.join(__dirname, 'data', 'Component.json');
  const componentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const componentCollection = db.collection('component');

    // Insert data only if the collection is empty
    const count = await componentCollection.countDocuments();
    if (count === 0) {
      await componentCollection.insertMany(componentData);
      console.log('Component data inserted into MongoDB');
    } else {
      console.log('Component data already exists in the database');
    }
  } catch (error) {
    console.error('Error loading data to MongoDB:', error);
  }
}

// Call the function to load data from component.json
loadDataToDatabase();

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

// CRUD API routes for users-2

// Create a new user
app.post('/api/users-2', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Get all users
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

// Update a user by ID
app.put('/api/users-2/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    const { id } = req.params;
    const updatedUser = req.body;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user by ID
app.delete('/api/users-2/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db('myDatabase');
    const userCollection = db.collection('users-2');
    const { id } = req.params;

    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Export the app for Vercel
module.exports = app;



