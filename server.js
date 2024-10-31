/* // server.js

Logging class: 1000

Step 1: Backend (Node.js) server setup for proximity checking and API handling

# The following code outlines the setup of a basic Node.js Express server
# with two endpoints:
# - `/api/setLocation`: Receives user location and radius in statute miles and converts to nautical miles
# - `/api/getAircrafts`: Queries the airplanes.live API based on location and radius, filtering results

# A package.json file should accompany this for dependencies (express, axios, cookie-parser)

# 1. Create a new file named `server.js` and copy this code.
# 2. Install the necessary packages with:
#    npm install express axios cookie-parser

*/

const express = require('express'); 
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS middleware first
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Then parsers
app.use(express.json());
app.use(cookieParser());

// Converts statute miles to nautical miles 
const convertMilesToNautical = (miles) => miles * 0.868976;

// Endpoint to set user location and radius, saved in cookies
app.post('/api/setLocation', (req, res) => {
    const { lat, lon, radius, altitude } = req.body;
    
    // Calculate the maximum range (3.0x radius) and convert to nautical miles
    const maxRange = radius * 3.5;  // see WarningIndicators.tsx
    
    const cookieOptions = {
        maxAge: 604800000, // 7 days
        sameSite: 'Lax',
        secure: false,
        httpOnly: false,
        path: '/',
    };
    
    // Store original statute radius in cookie (not the expanded range)
    res.cookie('userLocation', JSON.stringify({ lat, lon }), cookieOptions);
    res.cookie('userRadius', radius, cookieOptions);  // Store original radius
    res.cookie('userAltitude', altitude, cookieOptions);

    res.status(200).json({ message: 'Location and settings saved' });
});

// Add a variable to track pause state
let isPaused = false;

// Add a new endpoint to handle pause state
app.post('/api/setPauseState', (req, res) => {
    const { isPaused: newPauseState } = req.body;
    isPaused = newPauseState;
    res.status(200).json({ message: 'Pause state updated', isPaused });
});

app.get('/api/getAircrafts', async (req, res) => {
    if (isPaused) {
        return res.status(200).json({ message: 'Updates paused', data: [] });
    }
    try {
        // Calculate the maximum range (3.0x radius) and convert to nautical miles
        const maxRange = parseFloat(req.cookies.userRadius) * 3.5;  // see WarningIndicators.tsx

        if (!req.cookies.userLocation || !req.cookies.userRadius) {
            return res.status(400).json({ message: 'Location and radius are not set. Please set them first.' });
        }

        const { lat, lon } = JSON.parse(req.cookies.userLocation);
        const radius = maxRange;
        const altitude = parseFloat(req.cookies.userAltitude);

       // console.log(`Parsed values - Lat: ${lat}, Lon: ${lon}, Radius: ${radius}, Altitude: ${altitude}`);

        const response = await axios.get(`https://api.airplanes.live/v2/point/${lat}/${lon}/${radius}`);
        const aircraftData = response.data.ac.map(ac => ({
            total:    ac.total || 'N/A',
            callsign: ac.flight || 'N/A',
            altitude: ac.alt_baro || 'N/A',
            distance: ac.dst || 'N/A',
        }));
        console.log("Lat:", lat, "Lon:", lon, "Radius:", radius, "Altitude:", altitude,"Count:", aircraftData.length); // Log the values
        res.status(200).json(aircraftData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: 'Error fetching aircraft data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*
# To run the server:
# 1. Save this file as `server.js`
# 2. Run `node server.js` in the terminal
*/