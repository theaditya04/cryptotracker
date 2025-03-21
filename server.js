const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint to fetch data for a specific cryptocurrency
app.get('/api/crypto', async (req, res) => {
    try {
        const query = req.query.query?.toLowerCase() || ''; // Normalize input
        if (!query) {
            return res.status(400).json({ error: "Cryptocurrency query is required" });
        }

        const params = {};
        if (query.length <= 5) {
            // Use symbol if input is short (e.g., BTC)
            params.symbol = query.toUpperCase();
        } else {
            // Use slug if input is longer (e.g., bitcoin)
            params.slug = query;
        }

        const response = await axios.get("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest", {
            headers: {
                "X-CMC_PRO_API_KEY": "a7576467-cb07-4601-81a2-1eaebdad7448"
            },
            params
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data. Please try again later." });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
