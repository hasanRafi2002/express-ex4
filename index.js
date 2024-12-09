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

// // Load and insert data from component.json into MongoDB
// async function loadDataToDatabase() {
//   const dataFilePath = path.join(__dirname, 'data', 'Component.json');
//   const componentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     // Insert data only if the collection is empty
//     const count = await componentCollection.countDocuments();
//     if (count === 0) {
//       await componentCollection.insertMany(componentData);
//       console.log('Component data inserted into MongoDB');
//     } else {
//       console.log('Component data already exists in the database');
//     }
//   } catch (error) {
//     console.error('Error loading data to MongoDB:', error);
//   }
// }

// // Call the function to load data from component.json
// loadDataToDatabase();

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

// // CRUD API routes for users-2

// // Create a new user
// app.post('/api/users-2', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');
//     const newUser = req.body;
//     const result = await userCollection.insertOne(newUser);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Error creating user' });
//   }
// });

// // Get all users
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

// // Update a user by ID
// app.put('/api/users-2/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');
//     const { id } = req.params;
//     const updatedUser = req.body;

//     const result = await userCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updatedUser }
//     );

//     if (result.modifiedCount > 0) {
//       res.json({ message: 'User updated successfully' });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Error updating user' });
//   }
// });

// // Delete a user by ID
// app.delete('/api/users-2/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');
//     const { id } = req.params;

//     const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount > 0) {
//       res.json({ message: 'User deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Error deleting user' });
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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection Configuration
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database Connection Function
async function connectToDatabase() {
  try {
    if (!client.isConnected()) {
      await client.connect();
      console.log('Successfully connected to MongoDB');
    }
    return client.db('myDatabase');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

// Logging Middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

app.use(requestLogger);

// CRUD Routes for Equipment Items

// Create a new equipment item
app.post('/api/users-2', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users-2');
    
    // Validate input
    const { itemName, description, price } = req.body;
    if (!itemName || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await collection.insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Equipment item created successfully',
      itemId: result.insertedId
    });
  } catch (error) {
    next(error);
  }
});

// Get all equipment items
app.get('/api/users-2', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users-2');
    
    // Optional filtering
    const { userEmail } = req.query;
    const query = userEmail ? { userEmail: userEmail } : {};

    const users = await collection.find(query).toArray();
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No equipment items found' });
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get a single equipment item by ID
app.get('/api/users-2/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users-2');
    
    const item = await collection.findOne({ 
      _id: new ObjectId(req.params.id) 
    });

    if (!item) {
      return res.status(404).json({ message: 'Equipment item not found' });
    }

    res.json(item);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid equipment item ID' });
    }
    next(error);
  }
});

// Update an equipment item
app.put('/api/users-2/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users-2');
    
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Equipment item not found' });
    }

    res.json({ 
      message: 'Equipment item updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    next(error);
  }
});

// Delete an equipment item
app.delete('/api/users-2/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users-2');
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Equipment item not found' });
    }

    res.json({ 
      message: 'Equipment item deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    next(error);
  }
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Use error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;