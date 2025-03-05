const { MongoClient } = require('mongodb');
const dns = require('dns'); // To check internet connectivity
require('dotenv').config();

let db = null;
let client = null;
const maxRetryAttempts = 5;
const retryDelay = 2000; // 2 seconds

const checkInternet = () => {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      resolve(!err);
    });
  });
};

// Function to wait until internet is restored
const waitForInternet = async () => {
  console.log('\x1b[33m⚠ Internet connection found. Waiting to reconnect...\x1b[0m');
  
  while (!(await checkInternet())) {
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }

  console.log('\x1b[32m✅ Internet connection restored! Attempting MongoDB connection...\x1b[0m');
};

const dbConnect = async (attempt = 1) => {
  try {
    // If already connected, just return the database instance
    if (db && client) {
      await client.db('ProjectDb').command({ ping: 1 });
      await waitForInternet();
      console.log('\x1b[32m✅ MongoDB connected.\x1b[0m');
      return db;
    }

    // **First check if internet is available before connecting**
    if (!(await checkInternet())) {
      await waitForInternet();
    }

    console.log(`\x1b[34m🔄 Attempting MongoDB connection: ${attempt}/${maxRetryAttempts}...\x1b[0m`);

    const uri = process.env.URI;
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db('ProjectDb');

    console.log('\x1b[32m✅ MongoDB Connected Successfully!\x1b[0m');
    return db;
  } catch (err) {
    console.error(`\x1b[31m❌ Connection attempt ${attempt}/${maxRetryAttempts} failed: ${err.message}\x1b[0m`);

    if (attempt < maxRetryAttempts) {
      console.log(`\x1b[33m🔄 Retrying connection in ${retryDelay / 1000} seconds...\x1b[0m`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return dbConnect(attempt + 1);
    } else {
      console.error('\x1b[31m🚨 Max retry attempts reached. Exiting...\x1b[0m');
      process.exit(1);
    }
  }
};

// Getter for database instance with auto-reconnect
const getDb = async () => {
  if (!db || !client) {
    console.log('\x1b[33m⚠ Database connection lost. Attempting to reconnect...\x1b[0m');
    await dbConnect();
  } else {
    try {
      await client.db('ProjectDb').command({ ping: 1 });
    } catch (err) {
      console.log('\x1b[33m⚠ Connection lost. Reconnecting...\x1b[0m');
      await dbConnect();
    }
  }
  return db;
};

// Close the database connection
const closeDb = async () => {
  if (client) {
    console.log('\x1b[36m🔌 Closing MongoDB connection...\x1b[0m');
    try {
      await client.close();
      console.log('\x1b[32m✅ MongoDB connection closed.\x1b[0m');
    } catch (err) {
      console.error('\x1b[31m❌ Error closing MongoDB:', err, '\x1b[0m');
    }
    db = null;
    client = null;
  } else {
    console.log('\x1b[33m⚠ No active MongoDB connection to close.\x1b[0m');
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  console.log('\x1b[31m🚨 Received SIGINT (CTRL + C). Shutting down...\x1b[0m');
  await closeDb();
  console.log('\x1b[36m👋 Process exiting...\x1b[0m');
  setTimeout(() => process.exit(0), 500);
});

module.exports = { dbConnect, getDb, closeDb };
