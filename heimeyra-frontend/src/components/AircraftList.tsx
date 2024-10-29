import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import useInterval from '../hooks/useInterval';

interface Aircraft {
    callsign: string;
    altitude: number | string;
    distance: number | string;
}

interface AircraftListProps {
    onNearestUpdate: (distance: number) => void;
    frequency: number;  // Add this to the interface
    onUpdateComplete: () => void;
}

// Add conversion helper at the top of the file
const nauticalToStatute = (nauticalMiles: number): number => {
    return nauticalMiles * 1.15078;
};

const AircraftList: React.FC<AircraftListProps> = ({ 
    onNearestUpdate,
    frequency,
    onUpdateComplete
}) => {
    const [cookies] = useCookies(['userAltitude']);
    const maxAltitude = cookies.userAltitude || 15000;
    const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const filterAndDisplayAircraft = (data: Aircraft[]) => {
        const filteredData = data.filter(ac => {
            const altitude = typeof ac.altitude === 'number' ? ac.altitude : 0;
            return altitude <= maxAltitude;
        });
        
        setAircraftList(filteredData);
        
        // Update nearest aircraft distance from filtered list
        const distances = filteredData.map(ac => 
            typeof ac.distance === 'number' ? ac.distance : Infinity
        );
        const nearest = Math.min(...distances);
        onNearestUpdate(nearest);
    };

    const fetchAircrafts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/getAircrafts', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (response.ok) {
                filterAndDisplayAircraft(data);
                onUpdateComplete(); // Signal completion
            } else {
                setError(data.message || 'Failed to fetch aircraft data');
            }
        } catch (err) {
            setError('Failed to fetch aircraft data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAircrafts();
        const interval = setInterval(fetchAircrafts, frequency * 1000);
        return () => clearInterval(interval);
    }, [frequency]); // Add frequency to dependencies

    return (
        <div className="aircraft-list">
            <h2>Nearby Aircraft</h2>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && aircraftList.length === 0 && (
                <div className="no-data">No aircraft in range</div>
            )}
            <ul>
                {aircraftList.map((aircraft, index) => (
                    <li key={`${aircraft.callsign}-${index}`} className="aircraft-item">
                        <div className="callsign">{aircraft.callsign}</div>
                        <div className="details">
                            <span>Alt: {aircraft.altitude} ft</span>
                            <span>Dist: {
                                typeof aircraft.distance === 'number' 
                                    ? nauticalToStatute(aircraft.distance).toFixed(1) 
                                    : aircraft.distance
                            } mi</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AircraftList;