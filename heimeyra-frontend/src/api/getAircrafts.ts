import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userLocation, userRadius, userAltitude } = req.cookies;
        
        if (!userLocation || !userRadius) {
            return res.status(400).json({ 
                message: 'Location and radius are not set. Please set them first.' 
            });
        }

        const { lat, lon } = JSON.parse(userLocation);
        const radius = parseFloat(userRadius);
        const altitude = parseFloat(userAltitude);

        const response = await axios.get(
            `https://api.airplanes.live/v2/point/${lat}/${lon}/${radius}`
        );
        
        const aircraftData = response.data.ac.map(ac => ({
            total: ac.total || 'N/A',
            callsign: ac.flight || 'N/A',
            altitude: ac.alt_baro || 'N/A',
            distance: ac.dst || 'N/A',
        }));

        res.status(200).json(aircraftData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: 'Error fetching aircraft data' });
    }
}