import React, { useEffect, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import api from '../api/api';

interface Aircraft {
    callsign: string;
    altitude: number | 'ground' | string;
    distance: number | string;
}

interface AircraftListProps {
    onNearestUpdate: (distance: number) => void;
    frequency: number;
    onUpdateComplete: () => void;
    isPaused: boolean;
    userRadius: number;
}

const AircraftList: React.FC<AircraftListProps> = ({ 
    onNearestUpdate,
    frequency,
    onUpdateComplete,
    isPaused,
    userRadius
}) => {
    const [cookies] = useCookies(['userAltitude']);
    const maxAltitude = cookies.userAltitude || 15000;
    const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const MAX_DISTANCE_MULTIPLIER = 3.5; // see WarningIndicators.tsx

    const filterAndDisplayAircraft = (data: Aircraft[]) => {
        const filteredData = data.filter(ac => {
            // First check if aircraft is on the ground
            if (ac.altitude === 'ground') return false;

            // Convert altitude to number for comparison
            const altitude = typeof ac.altitude === 'number' 
                ? ac.altitude 
                : parseInt(ac.altitude as string);

            // Convert distance from nautical to statute miles
            const statuteDistance = typeof ac.distance === 'number' 
                ? ac.distance * 1.15078 
                : Infinity;

            // Only include if:
            // 1. Altitude is valid and below maxAltitude
            // 2. Distance is within our maximum range (3.0x radius)
            return !isNaN(altitude) && 
                   altitude > 0 && 
                   altitude <= maxAltitude &&
                   statuteDistance <= (userRadius * MAX_DISTANCE_MULTIPLIER);
        })
        .sort((a, b) => {
            const distA = typeof a.distance === 'number' ? a.distance : Infinity;
            const distB = typeof b.distance === 'number' ? b.distance : Infinity;
            return distA - distB;
        });
        
        setAircraftList(filteredData);
        
        // Update nearest aircraft distance
        const distances = filteredData.map(ac => 
            typeof ac.distance === 'number' ? ac.distance : Infinity
        );
        const nearest = Math.min(...distances);
        onNearestUpdate(nearest);
    };

    const fetchAircrafts = async () => {
        if (isPaused) return;
        setLoading(true);
        try {
            const response = await api.get('/api/getAircrafts');
            if (response.status === 200) {
                if (response.data.stats) {
                    console.log('🛩️ heimeyra data updated:', response.data.stats);
                }
                filterAndDisplayAircraft(response.data.data);
                onUpdateComplete();
            } else {
                setError(response.data.message || 'Refresh paused');
            }
        } catch (err) {
            if (isPaused) {
                setError('Refresh paused');
            } else {
                setError('Failed to fetch aircraft data');
            }
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAircrafts(); // Initial fetch
        const interval = setInterval(fetchAircrafts, frequency * 1000);
        return () => clearInterval(interval);
    }, [frequency, isPaused]); // Only re-run when frequency or pause state changes

    return (
        <div className="aircraft-list">
            <h2>Nearby Aircraft</h2>
            {loading && <div className="loading"></div>}
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
                                    ? (aircraft.distance * 1.15078).toFixed(1) 
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