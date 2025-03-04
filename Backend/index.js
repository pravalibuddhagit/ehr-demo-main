const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { dbConnect, closeDb } = require('./config/db'); // Import closeDb
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
 
// Connect to MongoDB before starting the server
dbConnect()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
 
    server.on('error', (err) => {
      console.error('Error starting the server:', err.message);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }); 
app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);