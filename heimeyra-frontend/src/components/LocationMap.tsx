/*eslint-disable */

import React, { useState, useEffect } from 'react';
import { Map as PigeonMap } from 'pigeon-maps';
import { useCookies } from 'react-cookie';
import api from '../api/api';

interface LocationMapProps {
    center: [number, number];
    zoom: number;
    onBoundsChanged: (newLat: number, newLon: number) => void;
}

const getProvider = (x: number, y: number, z: number) => 
    `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

const LocationMap: React.FC<LocationMapProps> = ({
    center: initialCenter,
    zoom: initialZoom,
    onBoundsChanged
}) => {
    const [center, setCenter] = useState<[number, number]>([47.6062, -122.3321]);
    const [zoom, setZoom] = useState<number>(8);
    const [cookies, setCookie] = useCookies(['userLocation']);
    const [error, setError] = useState<string | null>(null);
    const [lastSetLocation, setLastSetLocation] = useState<{lat: number, lon: number} | null>(null);

    // Initialize lat/lon state from cookies or defaults
    const [lat, setLat] = useState(cookies.userLocation?.lat || '');
    const [lon, setLon] = useState(cookies.userLocation?.lon || '');

    // Verify cookie updates using useEffect
    useEffect(() => {
        if (lastSetLocation && cookies.userLocation) {
            console.log('Verifying cookie update:', {
                last: lastSetLocation,
                current: cookies.userLocation
            });

            // Check if the cookie matches the last set values
            if (cookies.userLocation.lat !== lastSetLocation.lat || 
                cookies.userLocation.lon !== lastSetLocation.lon) {
                setError('Cookie values do not match expected values');
            } else {
                setError(null);
                console.log('Cookie updated successfully');
            }
        }
    }, [cookies.userLocation, lastSetLocation]);

    const updateLocationCookies = (newLat: number, newLon: number) => {
        const locationData = { lat: newLat, lon: newLon };

        // Update cookie
        setCookie('userLocation', locationData, { 
            path: '/',
            sameSite: 'Lax',
            secure: false,
        });
        
        // Optionally, send this info to the backend if needed
    };

    return (
        <div className="map-container">
            {error && (
                <div style={{ color: 'red', padding: '10px' }}>
                    Error: {error}
                </div>
            )}
            <div style={{ height: '400px', width: '100%' }}>
                <PigeonMap
                    center={center}
                    zoom={zoom}
                    provider={getProvider}
                    onBoundsChanged={({ center, zoom }) => { 
                        console.log('Map center changed to:', center);
                        setCenter(center as [number, number]);
                        setZoom(zoom);
                        updateLocationCookies(center[0], center[1]);
                    }}
                />
            </div>
        </div>
    );
};

export default LocationMap;