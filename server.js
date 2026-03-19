const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 60 }); // 1 minute cache

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Kandilli Live Earthquakes API (Public endpoint example)
const KANDILLI_API = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live';

app.get('/api/earthquakes', async (req, res) => {
    try {
        const cachedData = cache.get('earthquakes');
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get(KANDILLI_API);
        const data = response.data;
        
        console.log(`Fetched ${data.result ? data.result.length : 0} earthquakes from API`);
        
        // Structure the data consistently
        const earthquakes = data.result || [];
        
        cache.set('earthquakes', earthquakes);
        res.json(earthquakes);
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
