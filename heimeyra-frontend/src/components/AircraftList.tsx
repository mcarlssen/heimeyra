import React, { useEffect, useState } from 'react';
import api from './axios';

interface Aircraft {
    callsign: string;
    altitude: number | string;  // Changed to allow 'N/A'
    distance: number | string;  // Changed to allow 'N/A'
}

const AircraftList: React.FC = () => {
    const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);  // Add loading state

    const fetchAircrafts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/getAircrafts');
            console.log('Aircraft data received:', response.data); // Debug log
            setAircraftList(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching aircraft data:", err);
            setError("Failed to fetch aircraft data. Please try again later.");
            setAircraftList([]); // Clear the list on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAircrafts();
        // Set up polling every 10 seconds
        const interval = setInterval(fetchAircrafts, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="AircraftList">
            <h2>Nearby Aircraft</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && aircraftList.length === 0 && (
                <p>No aircraft found in range</p>
            )}
            <ul>
                {aircraftList.map((ac, index) => (
                    <li key={`${ac.callsign}-${index}`}>
                        {ac.callsign} - Alt: {ac.altitude} ft - Dist: {
                            typeof ac.distance === 'number' 
                                ? ac.distance.toFixed(1) 
                                : ac.distance
                        } nm
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AircraftList;