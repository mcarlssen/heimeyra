/*eslint-disable */

import React, { useState, useEffect } from 'react';
import { Map as PigeonMap } from 'pigeon-maps';
import { useCookies } from 'react-cookie';
import api from '../api/api';
import type { Point } from 'pigeon-maps';

interface LocationMapProps {
    center?: [number, number];
    zoom?: number;
    onBoundsChanged?: (bounds: any) => void;
}

const getProvider = (x: number, y: number, z: number) => 
    `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

const LocationMap: React.FC<LocationMapProps> = ({
    center: initialCenter,
    zoom: initialZoom,
    onBoundsChanged
}) => {
    const [mapCenter, setMapCenter] = useState<Point>(initialCenter || [47.6062, -122.3321]);
    const [mapZoom, setMapZoom] = useState(initialZoom || 8);
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
            sameSite: 'lax',
            secure: false,
        });
        
        // Optionally, send this info to the backend if needed
    };

    const handleBoundsChanged = ({ center, zoom }: { center: Point; zoom: number }) => {
        setMapCenter([center[0], center[1]]);
        setMapZoom(zoom);
        updateLocationCookies(center[0], center[1]);
    };

    return (
        <div className="map-container">
            {error && (
                <div style={{ color: 'red', padding: '10px' }}>
                    Error: {error}
                </div>
            )}
            <div style={{ height: '400px', width: '100%' }}>
                {/* @ts-ignore */}
                <PigeonMap
                    center={mapCenter}
                    zoom={mapZoom}
                    provider={getProvider}
                    onBoundsChanged={handleBoundsChanged}
                />
            </div>
        </div>
    );
};

export default LocationMap;