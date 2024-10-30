import React, { useState } from 'react';
import api from '../api/api';
import { useCookies } from 'react-cookie';

const LocationInput: React.FC = () => {
    const [cookies, setCookie] = useCookies(['userLocation', 'userRadius']);
    const [lat, setLat] = useState(cookies.userLocation?.lat || '');
    const [lon, setLon] = useState(cookies.userLocation?.lon || '');
    const [radius, setRadius] = useState(cookies.userRadius || '');
    const [error, setError] = useState<string | null>(null);

    const saveLocation = async () => {
        try {
            const locationData = {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                radius: parseFloat(radius)
            };
            
            await api.post('/api/setLocation', locationData);
            setError(null);
            alert("Location and radius saved!");
        } catch (err) {
            setError("Failed to save location. Please check your inputs and try again.");
            console.error("Error saving location:", err);
        }
    };

    return (
        <div>
            <h2>Set Location and Radius</h2>
            <label>Latitude: <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} /></label>
            <label>Longitude: <input type="text" value={lon} onChange={(e) => setLon(e.target.value)} /></label>
            <label>Radius (miles): <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} /></label>
            <button onClick={saveLocation}>Save</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LocationInput;
