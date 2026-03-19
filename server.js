const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 60 });

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const KANDILLI_API = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live';

// API Handler
const apiHandler = async (req, res) => {
    try {
        const cachedData = cache.get('earthquakes');
        if (cachedData) return res.json(cachedData);

        const response = await axios.get(KANDILLI_API, { 
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (response.data && response.data.result) {
            const earthquakes = response.data.result;
            cache.set('earthquakes', earthquakes);
            return res.json(earthquakes);
        } else {
            throw new Error('API format mismatch');
        }
    } catch (error) {
        res.status(500).json({ error: 'Veri çekilemedi', details: error.message });
    }
};

/**
 * CRITICAL FIX FOR CPANEL SUBFOLDERS
 * This regex matches any path ending in /api/earthquakes
 * Examples: /api/earthquakes, /deprem-sitesi/api/earthquakes, /app/api/earthquakes
 */
app.get(/.*\/api\/earthquakes$/, apiHandler);
app.get('/api/earthquakes', apiHandler); // Fallback for root

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
