'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, CloudLightning, ShieldAlert, Zap } from 'lucide-react';
import MapWrapper from './MapWrapper';

export default function Dashboard() {
    const [nowcast, setNowcast] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    
    // Yahan hum automatically Vercel ka environment variable ya fallback URL lenge
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stormsight-backend-demo.onrender.com/api/v1';

    useEffect(() => {
        axios.get(`${API_URL}/alerts`).then(res => setAlerts(res.data)).catch(() => {});
        runNowcast(23.2599, 77.4126);
    }, []);

    const runNowcast = async (lat: number, lon: number) => {
        try {
            const res = await axios.post(`${API_URL}/nowcast/run`, { lat, lon });
            setNowcast(res.data);
        } catch (e) { console.error("API error"); }
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-2"><CloudLightning /> StormSight AI</h1>
                <p className="text-slate-400 mt-2">SIH26072 | AI-powered Thunderstorm Nowcasting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Spatial Risk Analysis</h2>
                    <div className="flex-1 rounded-lg overflow-hidden border border-slate-700">
                        <MapWrapper onLocationSelect={runNowcast} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h2 className="text-lg font-semibold mb-4 text-emerald-400">Live Telemetry</h2>
                    {nowcast ? (
                        <div className="space-y-4">
                            <p><strong>Storm Probability:</strong> {(nowcast.storm_probability * 100).toFixed(1)}%</p>
                            <p><strong>Lightning Risk:</strong> {(nowcast.lightning_probability * 100).toFixed(1)}%</p>
                            <p><strong>Risk Level:</strong> {nowcast.risk_level}</p>
                            <p><strong>CAPE:</strong> {nowcast.cape} J/kg</p>
                            <p><strong>Humidity:</strong> {nowcast.humidity}%</p>
                            <hr className="border-slate-800" />
                            <h3 className="text-red-400 font-bold flex items-center gap-2"><ShieldAlert size={18}/> Active Alerts</h3>
                            {alerts.map(a => <p key={a.id} className="text-sm text-slate-300">{a.message}</p>)}
                        </div>
                    ) : (
                        <p className="text-slate-500 animate-pulse">Loading AI prediction...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
