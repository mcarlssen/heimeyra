/*eslint-disable */

import React, { useState } from 'react';
import { Map as PigeonMap } from 'pigeon-maps';

interface LocationMapProps {
    center: [number, number];
    zoom: number;
    onBoundsChanged: (newLat: number, newLon: number) => void;
}

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

const [center, setCenter] = useState([50.879, 4.6997]);
const [zoom, setZoom] = useState(11);

const LocationMap: React.FC<LocationMapProps> = ({
    center,
    zoom,
    onBoundsChanged
}) => {
    return (
        <div className="map-container" style={{ height: containerHeight, width: containerWidth }}>
            <PigeonMap
                center={center}
                zoom={zoom}
                provider={getProvider}
                onBoundsChanged={({ center, zoom }) => { 
                    setCenter(center) 
                    setZoom(zoom)
                    
                }}
            />
        </div>
    );
};

export default LocationMap;