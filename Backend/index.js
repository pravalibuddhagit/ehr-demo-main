const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

dbConnect();
app.listen(process.env.PORT || 5000, (err) => {
         if (err) console.log(err);
        console.log(`running at port ${process.env.PORT}`);
});
    
app.get("/", (req, res) => {
  res.send("api running");
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/manager',managerRoutes);