'use client';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

export default function MapComponent({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
    const [pos, setPos] = useState<{lat: number, lng: number} | null>({lat: 23.2599, lng: 77.4126});

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setPos(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        });
        return null;
    }

    return (
        <MapContainer center={[23.2599, 77.4126]} zoom={6} className="h-full w-full rounded-xl z-0" style={{ minHeight: '100%' }}>
            {/* 100% Free Esri Dark Map - No API Key Required */}
            <TileLayer 
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" 
                attribution="&copy; Esri"
            />
            <MapEvents />
            {pos && <CircleMarker center={[pos.lat, pos.lng]} radius={8} pathOptions={{ color: '#00f6ff', fillColor: '#00f6ff', fillOpacity: 0.8 }} />}
        </MapContainer>
    );
}
