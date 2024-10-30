/*eslint-disable */

import React, { useState } from 'react';
import { Map as PigeonMap } from 'pigeon-maps';

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
    const [center, setCenter] = useState<[number, number]>(initialCenter);
    const [zoom, setZoom] = useState(initialZoom);

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
                    onBoundsChanged(center[0], center[1]);
                }}
            />
        </div>
    );
};

export default LocationMap;