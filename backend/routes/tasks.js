const express = require('express');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Token received:', token);
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'secretkey');

};



// Create a Task
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;
        const task = new Task({ userId: req.user.id, title, description, deadline, priority });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Tasks for a User
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a Task
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a Task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
