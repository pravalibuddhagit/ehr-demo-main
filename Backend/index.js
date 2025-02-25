const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { dbConnect, closeDb } = require('./config/db'); // Import closeDb
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

dbConnect().then(() => {
  const server = app.listen(process.env.PORT || 5000, (err) => {
    if (err) console.log(err);
    console.log(`Running at port ${process.env.PORT || 5000}`);
  });

  // Handle server shutdown gracefully
  process.on('SIGINT', async () => {
    await closeDb();
    server.close(() => {
      console.log('Server shut down');
      process.exit(0);
    });
  });
});

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);