const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Submit User Data
router.post('/users', async (req, res) => {
    try {
        const { name, age, phone, email, address, pincode } = req.body;

        // Basic validation
        if (!name || !age || !phone || !email || !address || !pincode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await prisma.user.create({
            data: {
                name,
                age: parseInt(age),
                phone,
                email,
                address,
                pincode
            }
        });

        res.status(201).json({ message: 'User data saved successfully', user });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.adminId = decoded.id;
        next();
    });
};

// Get Users (Protected)
router.get('/admin/users', verifyToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const totalCount = await prisma.user.count();

        res.json({ users, totalCount });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
