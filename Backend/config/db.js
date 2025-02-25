const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;
const maxRetryAttempts = 5;
const retryDelay = 2000; // 2 seconds

const dbConnect = async (attempt = 1) => {
  try {
    if (db && client) {
      // Test if the connection is still alive by running a simple command
      await client.db('ProjectDb').command({ ping: 1 });
      console.log('MongoDB Already Connected');
      return db;
    }

    const uri = process.env.URI; // mongodb+srv://smohammad:<hehe pwrd>@cluster0.8h0h8.mongodb.net/ProjectDb
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db('ProjectDb');
    console.log('MongoDB Connected');
    return db;
  } catch (err) {
    console.error(`Connection attempt ${attempt} failed: ${err.message}`);

    if (attempt < maxRetryAttempts) {
      console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return dbConnect(attempt + 1);
    } else {
      console.error('Max retry attempts reached. Exiting process.');
      process.exit(1);
    }
  }
};

// Getter for the db instance with reconnection
const getDb = async () => {
  if (!db || !client) {
    console.log('Database connection not established. Attempting to reconnect...');
    await dbConnect();
  } else {
    try {
      // Verify the connection is still alive
      await client.db('ProjectDb').command({ ping: 1 });
    } catch (err) {
      console.log('Connection lost. Attempting to reconnect...');
      await dbConnect();
    }
  }
  return db;
};

// Graceful shutdown
const closeDb = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
    db = null;
    client = null;
  }
};

process.on('SIGINT', async () => {
  await closeDb();
  process.exit(0);
});

module.exports = { dbConnect, getDb, closeDb };