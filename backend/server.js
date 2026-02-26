require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use('/api', apiRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'User Collection API is running smoothly. 🚀' });
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: 'success',
            message: 'Server is healthy',
            database: 'Connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server is running but database connection failed',
            database: 'Failed'
        });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log(`✅ Database connected successfully.`);
    } catch (error) {
        console.error(`❌ Database connection failed.`, error);
    }
});
