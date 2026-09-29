'use client';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';

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
        <MapContainer center={[23.2599, 77.4126]} zoom={6} className="h-full w-full rounded-lg z-0">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <MapEvents />
            {pos && <CircleMarker center={[pos.lat, pos.lng]} radius={8} pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4' }} />}
        </MapContainer>
    );
}
