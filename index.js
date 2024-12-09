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







// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const uri = process.env.MONGO_URI;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let isConnected = false;

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

// // USERS-2 ROUTES
// // Get all users with advanced filtering
// app.get('/api/users-2', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');

//     // Pagination and filtering
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = {};
//     if (req.query.categoryName) filter.categoryName = req.query.categoryName;
//     if (req.query.stockStatus) filter.stockStatus = req.query.stockStatus;
    
//     // Price range filtering
//     if (req.query.minPrice || req.query.maxPrice) {
//       filter.price = {};
//       if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
//       if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
//     }

//     // Sorting
//     const sort = {};
//     if (req.query.sortBy) {
//       sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
//     }

//     const users = await userCollection
//       .find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const totalUsers = await userCollection.countDocuments(filter);

//     res.json({
//       users,
//       currentPage: page,
//       totalPages: Math.ceil(totalUsers / limit),
//       totalUsers
//     });
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ message: 'Error retrieving users' });
//   }
// });

// // Get single user by ID
// app.get('/api/users-2/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');

//     const user = await userCollection.findOne({ 
//       _id: new ObjectId(req.params.id) 
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error('Error retrieving user:', error);
//     res.status(500).json({ message: 'Error retrieving user' });
//   }
// });

// // Create new user
// app.post('/api/users-2', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');

//     const newUser = {
//       ...req.body,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const result = await userCollection.insertOne(newUser);

//     res.status(201).json({
//       message: 'User created successfully',
//       userId: result.insertedId,
//       user: newUser
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Error creating user' });
//   }
// });

// // Update user
// app.put('/api/users-2/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');

//     const userId = new ObjectId(req.params.id);
//     const updateData = {
//       ...req.body,
//       updatedAt: new Date()
//     };

//     const result = await userCollection.updateOne(
//       { _id: userId },
//       { $set: updateData }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ 
//       message: 'User updated successfully',
//       modifiedCount: result.modifiedCount 
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Error updating user' });
//   }
// });

// // Delete user
// app.delete('/api/users-2/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');

//     const result = await userCollection.deleteOne({ 
//       _id: new ObjectId(req.params.id) 
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ 
//       message: 'User deleted successfully',
//       deletedCount: result.deletedCount 
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Error deleting user' });
//   }
// });

// // COMPONENTS ROUTES
// // Get all components with advanced filtering
// app.get('/api/component', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     // Pagination and filtering
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = {};
//     if (req.query.category) filter.category = req.query.category;
//     if (req.query.inStock) filter.inStock = req.query.inStock === 'true';
    
//     // Price range filtering
//     if (req.query.minPrice || req.query.maxPrice) {
//       filter.price = {};
//       if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
//       if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
//     }

//     // Sorting
//     const sort = {};
//     if (req.query.sortBy) {
//       sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
//     }

//     const components = await componentCollection
//       .find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const totalComponents = await componentCollection.countDocuments(filter);

//     res.json({
//       components,
//       currentPage: page,
//       totalPages: Math.ceil(totalComponents / limit),
//       totalComponents
//     });
//   } catch (error) {
//     console.error('Error retrieving components:', error);
//     res.status(500).json({ message: 'Error retrieving components' });
//   }
// });

// // Get single component by ID
// app.get('/api/component/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     const component = await componentCollection.findOne({ 
//       _id: new ObjectId(req.params.id) 
//     });

//     if (!component) {
//       return res.status(404).json({ message: 'Component not found' });
//     }

//     res.json(component);
//   } catch (error) {
//     console.error('Error retrieving component:', error);
//     res.status(500).json({ message: 'Error retrieving component' });
//   }
// });

// // Create new component
// app.post('/api/component', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     const newComponent = {
//       ...req.body,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const result = await componentCollection.insertOne(newComponent);

//     res.status(201).json({
//       message: 'Component created successfully',
//       componentId: result.insertedId,
//       component: newComponent
//     });
//   } catch (error) {
//     console.error('Error creating component:', error);
//     res.status(500).json({ message: 'Error creating component' });
//   }
// });

// // Update component
// app.put('/api/component/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     const componentId = new ObjectId(req.params.id);
//     const updateData = {
//       ...req.body,
//       updatedAt: new Date()
//     };

//     const result = await componentCollection.updateOne(
//       { _id: componentId },
//       { $set: updateData }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: 'Component not found' });
//     }

//     res.json({ 
//       message: 'Component updated successfully',
//       modifiedCount: result.modifiedCount 
//     });
//   } catch (error) {
//     console.error('Error updating component:', error);
//     res.status(500).json({ message: 'Error updating component' });
//   }
// });

// // Delete component
// app.delete('/api/component/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');

//     const result = await componentCollection.deleteOne({ 
//       _id: new ObjectId(req.params.id) 
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'Component not found' });
//     }

//     res.json({ 
//       message: 'Component deleted successfully',
//       deletedCount: result.deletedCount 
//     });
//   } catch (error) {
//     console.error('Error deleting component:', error);
//     res.status(500).json({ message: 'Error deleting component' });
//   }
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!', 
//     error: process.env.NODE_ENV === 'production' ? {} : err.message 
//   });
// });

// // Export the app for Vercel
// module.exports = app;





// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

// // CRUD API routes for `/api/users-2`

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

// // Add a new user
// app.post('/api/users-2', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const userCollection = db.collection('users-2');
//     const newUser = req.body;
//     const result = await userCollection.insertOne(newUser);
//     res.status(201).json({ message: 'User added successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('Error adding user:', error);
//     res.status(500).json({ message: 'Error adding user' });
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
//       res.status(404).json({ message: 'User not found or no changes made' });
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

// // CRUD API routes for `/api/component`

// // Get all components
// app.get('/api/component', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');
//     const components = await componentCollection.find().toArray();
//     res.json(components);
//   } catch (error) {
//     console.error('Error retrieving components:', error);
//     res.status(500).json({ message: 'Error retrieving components' });
//   }
// });

// // Add a new component
// app.post('/api/component', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');
//     const newComponent = req.body;
//     const result = await componentCollection.insertOne(newComponent);
//     res.status(201).json({ message: 'Component added successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('Error adding component:', error);
//     res.status(500).json({ message: 'Error adding component' });
//   }
// });

// // Update a component by ID
// app.put('/api/component/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');
//     const { id } = req.params;
//     const updatedComponent = req.body;
//     const result = await componentCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updatedComponent }
//     );
//     if (result.modifiedCount > 0) {
//       res.json({ message: 'Component updated successfully' });
//     } else {
//       res.status(404).json({ message: 'Component not found or no changes made' });
//     }
//   } catch (error) {
//     console.error('Error updating component:', error);
//     res.status(500).json({ message: 'Error updating component' });
//   }
// });

// // Delete a component by ID
// app.delete('/api/component/:id', async (req, res) => {
//   try {
//     await connectToDatabase();
//     const db = client.db('myDatabase');
//     const componentCollection = db.collection('component');
//     const { id } = req.params;
//     const result = await componentCollection.deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount > 0) {
//       res.json({ message: 'Component deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'Component not found' });
//     }
//   } catch (error) {
//     console.error('Error deleting component:', error);
//     res.status(500).json({ message: 'Error deleting component' });
//   }
// });

// // Export the app for Vercel
// module.exports = app;
