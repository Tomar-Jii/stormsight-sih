'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, CloudLightning, ShieldAlert, Zap, Thermometer, Droplets, Wind } from 'lucide-react';
import MapWrapper from './MapWrapper';

export default function Dashboard() {
    const [nowcast, setNowcast] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stormsight.onrender.com/api/v1';

    useEffect(() => {
        axios.get(`${API_URL}/alerts`).then(res => setAlerts(res.data)).catch(() => {});
        runNowcast(23.2599, 77.4126);
    }, []);

    const runNowcast = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/nowcast/run`, { lat, lon });
            setNowcast(res.data);
        } catch (e) { console.error("API error"); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-2">
            {/* Advanced Header */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-3">
                        <CloudLightning className="text-cyan-400 h-10 w-10" /> StormSight AI
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium tracking-wide">SIH26072 | Advanced Meteorological Nowcasting</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-sm font-bold tracking-widest">LIVE DATA</span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Map Section */}
                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 flex flex-col shadow-xl min-h-[450px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                            <Activity className="text-cyan-400"/> Spatial Risk Map
                        </h2>
                        {loading && <span className="text-cyan-400 text-sm font-mono animate-pulse">Processing Model...</span>}
                    </div>
                    {/* Fixed Mobile Height */}
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-600 shadow-inner min-h-[350px]">
                        <MapWrapper onLocationSelect={runNowcast} />
                    </div>
                </div>

                {/* Telemetry Section */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-700 pb-3">
                        <Zap /> Live Telemetry
                    </h2>
                    
                    {nowcast ? (
                        <div className="space-y-5">
                            {/* Primary Stats with styling */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 shadow-inner">
                                    <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Storm Prob</p>
                                    <p className="text-2xl font-bold text-cyan-400">{(nowcast.storm_probability * 100).toFixed(1)}%</p>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 shadow-inner">
                                    <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Lightning Risk</p>
                                    <p className="text-2xl font-bold text-amber-400">{(nowcast.lightning_probability * 100).toFixed(1)}%</p>
                                </div>
                            </div>

                            {/* Secondary Stats */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-sm shadow-inner">
                                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Thermometer size={16} className="text-red-400"/> CAPE</span> <span className="text-slate-100 font-bold">{nowcast.cape} J/kg</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Droplets size={16} className="text-blue-400"/> Humidity</span> <span className="text-slate-100 font-bold">{nowcast.humidity}%</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Wind size={16} className="text-slate-300"/> Radar Refl</span> <span className="text-slate-100 font-bold">{nowcast.radar_reflectivity} dBZ</span></div>
                            </div>

                            {/* Active Alerts */}
                            <div className="mt-2">
                                <h3 className="text-red-400 font-bold flex items-center gap-2 mb-3"><ShieldAlert size={18}/> Active Warnings</h3>
                                {alerts.map(a => (
                                    <div key={a.id} className="bg-red-950/40 border-l-4 border-red-500 p-3 rounded-r-lg text-sm shadow-md">
                                        <strong className="text-red-400 block mb-1 font-mono tracking-wide">{a.severity} • {a.location}</strong>
                                        <span className="text-red-200">{a.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 animate-pulse font-mono text-sm">Initializing ML Models...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
