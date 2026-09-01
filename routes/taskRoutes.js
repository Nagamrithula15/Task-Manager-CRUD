const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. CREATE a new task
// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description,
      status
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET all tasks
// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET a single task by ID
// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE a task by ID
// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Optional validation if title is explicitly provided empty
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE a task by ID
// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
