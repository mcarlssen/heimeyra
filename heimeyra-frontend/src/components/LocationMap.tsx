/*eslint-disable */

import React, { useState, useEffect } from 'react';
import { Map as PigeonMap } from 'pigeon-maps';
import { useCookies } from 'react-cookie';

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
    const [center, setCenter] = useState<[number, number]>([41, -81]);
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

    const updateLocationCookies = async (newLat: number, newLon: number) => {
        try {
            console.log('Attempting to set new location:', newLat, newLon);
            
            // Update local state
            setLat(newLat.toString());
            setLon(newLon.toString());

            // Store the values we're trying to set
            setLastSetLocation({ lat: newLat, lon: newLon });

            // Prepare cookie data
            const locationData = { lat: newLat, lon: newLon };
            
            // Update cookie
            setCookie('userLocation', locationData, { 
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });

            // Call the parent's onBoundsChanged callback
            onBoundsChanged(newLat, newLon);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error setting location';
            console.error('Error updating location:', errorMessage);
            setError(errorMessage);
        }
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