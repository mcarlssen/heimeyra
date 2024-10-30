/*eslint-disable */

import React, { useState } from 'react';
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
    // Add state for map center
    const [center, setCenter] = useState<[number, number]>([41, -81]);
    const [zoom, setZoom] = useState<number>(8);  // Add this if missing

    const [cookies, setCookie] = useCookies(['userLocation', 'userRadius', 'userAltitude']);
    const userLocation = cookies.userLocation;
    const userRadius = cookies.userRadius;
    const userAltitude = cookies.userAltitude;

    const [lat, setLat] = useState(cookies.userLocation?.lat || '');
    const [lon, setLon] = useState(cookies.userLocation?.lon || '');

    // Add this function before the return statement
    const updateLocationCookies = (newLat: number, newLon: number) => {
        console.log('Setting new location:', newLat, newLon);

        setLat(newLat.toString());
        setLon(newLon.toString());

        // Update cookies
        setCookie('userLocation', { lat: newLat, lon: newLon }), { path: '/' };
        setCookie('userRadius', userRadius);
        setCookie('userAltitude', userAltitude);
    };

    return (
        <div className="map-container" style={{ height: '400px', width: '100%' }}>
            <PigeonMap
                center={center}
                zoom={zoom}
                provider={getProvider}
                onBoundsChanged={({ center, zoom }) => { 
                    console.log('Map center changed to:', center);  // Added console.log
                    setCenter(center as [number, number]);
                    setZoom(zoom);
                    updateLocationCookies(center[0], center[1]);
                }}
            />
        </div>
    );
};

export default LocationMap;