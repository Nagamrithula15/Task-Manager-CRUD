require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Serve static frontend files (HTML, CSS, Vanilla JS)
app.use(express.static('public'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Mount task CRUD routes
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API is healthy' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
