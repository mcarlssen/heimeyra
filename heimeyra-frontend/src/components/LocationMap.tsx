import React from 'react';
import { Map as PigeonMap } from 'pigeon-maps';

interface LocationMapProps {
    center: [number, number];
    zoom: number;
    containerHeight: number;
    containerWidth: number;
    onLocationChange?: (lat: string, lon: string) => void;
    onCenterChange?: (lat: string, lon: string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
    center,
    zoom,
    containerHeight,
    containerWidth,
    onLocationChange,
    onCenterChange
}) => {
    const handleClick = (event: { latLng: [number, number] }) => {
        if (onLocationChange) {
            onLocationChange(event.latLng[0].toString(), event.latLng[1].toString());
        }
    };

    const handleBoundsChange = ({ center }: { center: [number, number] }) => {
        if (onCenterChange) {
            onCenterChange(center[0].toString(), center[1].toString());
        }
    };

    return (
        <div className="map-container" style={{ height: containerHeight, width: containerWidth }}>
            <PigeonMap
                height={containerHeight}
                width={containerWidth}
                center={center}
                zoom={zoom}
                onClick={handleClick}
                onBoundsChanged={handleBoundsChange}
            />
        </div>
    );
};

export default LocationMap;