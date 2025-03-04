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
  console.log('Waiting for internet connection...');
  while (!(await checkInternet())) {
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }
  console.log('Internet connection restored!');
};

const dbConnect = async (attempt = 1) => {
  try {
    if (db && client) {
      // Test if the connection is still alive by running a simple command
      await client.db('ProjectDb').command({ ping: 1 });
      console.log('MongoDB Already Connected');
      return db;
    }

     // Wait for internet if it's down
     if (!(await checkInternet())) {
      await waitForInternet();
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
      console.error('Max retry attempts reached. exiting...');
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

const closeDb = async () => {
  if (client) {
    console.log('Closing MongoDB connection...');
    try {
      await client.close(); // Ensure the client fully closes before exiting
      console.log('MongoDB connection closed'); // This should now always appear
    } catch (err) {
      console.error('Error closing MongoDB:', err);
    }
    db = null;
    client = null;
  } else {
    console.log('No active MongoDB connection to close.');
  }
};
 
process.on('SIGINT', async () => {
  console.log('Received SIGINT (CTRL + C). Shutting down...');
  await closeDb();
 
  console.log('Process exiting...');
  setTimeout(() => process.exit(0), 500); // Small delay to allow logs to appear
});
 

module.exports = { dbConnect, getDb, closeDb };