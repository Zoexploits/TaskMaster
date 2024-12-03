const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Debug: Log provided email and password
    console.log('Provided email:', email);
    console.log('Provided password:', password);

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,   // Include the username
            email,      // Include the email
            password: hashedPassword,  // Include the hashed password
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Debug: Log provided email and password
    console.log('Provided email:', email);
    console.log('Provided password:', password);

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Debug: Log retrieved hashed password
        console.log('Hashed password in DB:', user.password);

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // Debug: Log the result of bcrypt comparison
        console.log('Password match result:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('Provided password:', password);


        // Generate JWT (optional but recommended)
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1h' }
        );

        // Send success response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
