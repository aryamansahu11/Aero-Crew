import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProfileIcon = ({ initials, onClick, isOpen }) => {
  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className="relative flex items-center justify-center w-10 h-10 ml-4 rounded-full bg-violet-600 text-white font-semibold text-sm hover:ring-2 hover:ring-violet-300 transition-all shadow-md focus:outline-none"
      >
        {initials}
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 bg-green-400" />
      </button>

      {/* Profile Dropdown Box */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-900">Aryaman Sahu</p>
            <p className="text-xs text-slate-500">Admin • MoSPI Agent</p>
          </div>
          <div className="px-2 py-2">
            <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Settings</button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors mt-0.5">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

const routesData = [
  { code: 'DEL-BOM', pair: 'Delhi - Mumbai', weight: '0.1180', index: '98.0', wow: '+6.9%', mom: '-2.3%', obs: 380, coverage: 'Coverage 100%' },
  { code: 'BOM-DEL', pair: 'Mumbai - Delhi', weight: '0.1165', index: '100.7', wow: '+4.4%', mom: '-7.7%', obs: 373, coverage: 'Coverage 100%' },
  { code: 'BLR-DEL', pair: 'Bengaluru - Delhi', weight: '0.0985', index: '99.6', wow: '+4.3%', mom: '-3.2%', obs: 372, coverage: 'Coverage 100%' },
  { code: 'DEL-BLR', pair: 'Delhi - Bengaluru', weight: '0.0975', index: '105.4', wow: '+2.0%', mom: '-1.7%', obs: 368, coverage: 'Coverage 100%' },
  { code: 'BLR-BOM', pair: 'Bengaluru - Mumbai', weight: '0.0720', index: '103.0', wow: '+5.0%', mom: '+19.7%', obs: 291, coverage: 'Coverage 100%' },
  { code: 'BOM-BLR', pair: 'Mumbai - Bengaluru', weight: '0.0710', index: '99.3', wow: '-9.9%', mom: '-2.2%', obs: 358, coverage: 'Coverage 100%' },
];

const mapLocations = [
  { code: 'DEL', x: 31, y: 33, idx: 115.1, status: 'high' },
  { code: 'CCU', x: 61, y: 50, idx: 108.4, status: 'moderate' },
  { code: 'BOM', x: 23, y: 63, idx: 110.1, status: 'moderate' },
  { code: 'HYD', x: 36, y: 65, idx: 103.5, status: 'stable' },
  { code: 'BLR', x: 32, y: 79, idx: 101.2, status: 'stable' },
];

const mapRoutes = [
  { from: 'DEL', to: 'CCU', color: '#ef4444', dashed: false },
  { from: 'DEL', to: 'BOM', color: '#ef4444', dashed: true },
  { from: 'DEL', to: 'BLR', color: '#f59e0b', dashed: false },
  { from: 'BOM', to: 'HYD', color: '#10b981', dashed: false },
];

const carrierData = [
  { code: '6E', name: 'IndiGo', type: 'LCC', color: 'bg-[#990000]', fare: '₹9,115', change: '+8.9%', changeType: 'up', share: 62.5, quotes: '11,559', vol: '2.73', signal: 'Rising', sigType: 'up' },
  { code: 'AI', name: 'Air India', type: 'FSC', color: 'bg-red-600', fare: '₹10,385', change: '+9.5%', changeType: 'up', share: 14.5, quotes: '7,713', vol: '2.17', signal: 'Rising', sigType: 'up' },
  { code: 'UK', name: 'Vistara', type: 'FSC', color: 'bg-purple-700', fare: '₹11,250', change: '+4.2%', changeType: 'up', share: 9.8, quotes: '5,120', vol: '1.85', signal: 'Rising', sigType: 'up' },
  { code: 'IX', name: 'Air India Express', type: 'LCC', color: 'bg-orange-500', fare: '₹4,753', change: '—', changeType: 'neutral', share: 7.5, quotes: '1,450', vol: '2.10', signal: '—', sigType: 'neutral' },
  { code: 'QP', name: 'Akasa Air', type: 'LCC', color: 'bg-purple-500', fare: '₹8,558', change: '+14.5%', changeType: 'up', share: 4.8, quotes: '3,831', vol: '3.10', signal: 'Rising', sigType: 'up' },
  { code: 'SG', name: 'SpiceJet', type: 'LCC', color: 'bg-orange-400', fare: '₹8,460', change: '+15.0%', changeType: 'up', share: 3.2, quotes: '3,841', vol: '2.98', signal: 'Rising', sigType: 'up' },
];

const otaData = [
  { name: 'MakeMyTrip', fare: '₹9,450', quotes: '3,543' },
  { name: 'Cleartrip', fare: '₹9,510', quotes: '3,500' },
  { name: 'Yatra', fare: '₹9,480', quotes: '3,462' },
  { name: 'EaseMyTrip', fare: '₹9,350', quotes: '2,100' },
];

const channelHealth = [
  { name: 'IndiGo', quotes: '9191', change: '+8.9%', type: 'up', status: 'bg-emerald-500' },
  { name: 'Air India', quotes: '6149', change: '+9.5%', type: 'up', status: 'bg-emerald-500' },
  { name: 'Vistara', quotes: '4050', change: '+4.2%', type: 'up', status: 'bg-emerald-500' },
  { name: 'Akasa Air', quotes: '3063', change: '+14.5%', type: 'up', status: 'bg-emerald-500' },
  { name: 'SpiceJet', quotes: '3059', change: '+15.0%', type: 'up', status: 'bg-emerald-500' },
  { name: 'MakeMyTrip', quotes: '4673', change: '+10.6%', type: 'up', status: 'bg-emerald-500' },
];

const airfareCategories = [
  { category: 'Metro-to-Metro Corridors (High Density)', weight: '55.0%', index: '118.4', wow: '+8.2%', rtc: '+0.45%' },
  { category: 'Metro-to-Tier 2/3 Corridors', weight: '30.0%', index: '109.1', wow: '+3.1%', rtc: '+0.21%' },
  { category: 'Regional Connectivity (UDAN)', weight: '15.0%', index: '98.5', wow: '-1.4%', rtc: '-0.05%' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home'); 
  const [trendData, setTrendData] = useState([]);
  
  // Interactive States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // LIVE CLOCK & DATE STATE
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch Graph Data
    axios.get('http://127.0.0.1:8000/api/airfare-trend')
      .then(response => {
        setTrendData(response.data.trend_data);
      })
      .catch(error => {
        console.error("FastAPI backend se connect nahi ho paaya:", error);
      });

    // Live Clock Timer
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
  const formattedDate = currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={`min-h-screen font-sans pb-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* ========================================================================= */}
      {/* TOP HEADER / NAVBAR SECTION                                             */}
      {/* ========================================================================= */}
      <header className="bg-slate-900 text-white flex items-center justify-between px-6 py-3 shadow-md sticky top-0 z-50">
        
        {/* Left Side: Logo & Navigation Tabs */}
        <div className="flex items-center gap-8">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </div>
            <span className="text-xl font-bold tracking-wide">AeroCrew</span>
            <span className="bg-orange-500 text-xs text-white px-2 py-0.5 rounded-full ml-1">APIx</span>
          </div>
          
          {/* Navbar Menu Navigation Links (Tabs) */}
          <nav className="hidden xl:flex space-x-6 text-sm font-medium text-slate-300">
            <button onClick={() => setActiveTab('home')} className={`pb-1 transition-colors ${activeTab === 'home' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Home</button>
            <button onClick={() => setActiveTab('routes')} className={`pb-1 transition-colors ${activeTab === 'routes' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Routes & Windows</button>
            <button onClick={() => setActiveTab('airlines')} className={`pb-1 transition-colors ${activeTab === 'airlines' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Airlines</button>
            <button onClick={() => setActiveTab('booking')} className={`pb-1 transition-colors ${activeTab === 'booking' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Booking Windows</button>
            <button onClick={() => setActiveTab('heatmap')} className={`pb-1 transition-colors ${activeTab === 'heatmap' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Heatmap</button>
            <button onClick={() => setActiveTab('airfare')} className={`pb-1 transition-colors ${activeTab === 'airfare' ? 'text-white border-b-2 border-indigo-500' : 'hover:text-white'}`}>Airfare Index</button>
          </nav>
        </div>

        {/* Right Side: Utility Icons, API Access Button & User Profile */}
        <div className="flex items-center gap-4 text-slate-300">
          
          {/* Search Icon Button */}
          <button className="p-2.5 rounded-full hover:bg-slate-700/50 transition-colors" title="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          
          {/* Theme Mode Toggle Button */}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full hover:bg-slate-700/50 transition-colors" title="Toggle Theme">
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          
          {/* Notifications Alert Icon with Dropdown (Auto-closes profile menu) */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false); // Close profile if open
              }} 
              className="relative p-2.5 rounded-full hover:bg-slate-700/50 transition-colors focus:outline-none" 
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full ring-1 ring-slate-900 bg-red-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-sm text-slate-700 flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                </div>
                <div className="p-3.5 text-xs border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <span className="font-bold text-red-600 block mb-0.5">High Airfare Alert:</span> DEL-BOM route spiked by +6.9% today.
                </div>
                <div className="p-3.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer">
                  <span className="font-bold text-emerald-600 block mb-0.5">System Status:</span> Playwright Scraper Engine synced successfully.
                </div>
              </div>
            )}
          </div>
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium text-sm shadow transition-colors">
            API Access
          </button>
          
          {/* User Profile Avatar with Working Dropdown (Auto-closes notifications) */}
          <ProfileIcon 
            initials="AS" 
            isOpen={showProfileMenu} 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false); // Close notifications if open
            }} 
          />
        </div>
      </header>
      {/* ========================================================================= */}

      <main className="p-6 max-w-[1600px] mx-auto">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>National Airfare Intelligence Command Center</h1>
                <p className="text-base text-slate-400 mt-1">Measure, explain, forecast and simulate India's airfare-driven inflation.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">🕒</span> {formattedTime}
                </div>
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">📅</span> Data as of {formattedDate}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider opacity-90 uppercase">National Airfare Index</span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{formattedDate}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-5xl font-extrabold tracking-tight">114.59</h2>
                  <span className="text-sm opacity-80">points</span>
                  <span className="bg-red-500/20 text-red-200 text-xs px-2 py-1 rounded font-medium ml-2 flex items-center">
                    ▲ +7.3%
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-4">Base Period: Jan 2024 = 100 • Superlative Fisher: 114.5</p>
                <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-80">
                  Daily move +11.0% <br/> ILO / MoSPI CPI Manual (2012=100 Standard)
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-sm border transition-shadow flex flex-col justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Average Airfare</span>
                  <span className="bg-cyan-50 text-cyan-600 text-xs px-2 py-1 rounded-full border border-cyan-100 font-medium">National basket</span>
                </div>
                <div>
                  <h2 className={`text-5xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>₹9,589</h2>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded font-semibold flex items-center">▲ +6.7%</span>
                    <span className="text-slate-400">vs 26 Aug 2026 • 20 corridors</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  Composite across 20 DGCA corridors • 5 advance horizons <br/> DGCA weight-averaged fare index input
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-sm border transition-shadow flex flex-col justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Airfare Inflation Pressure</span>
                  <span className="text-xs text-slate-400 font-medium">AIPS</span>
                </div>
                <div className="flex items-center gap-5 mt-3">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center border-t-red-500 border-r-red-500 relative flex-shrink-0">
                    <div className="text-center">
                      <span className={`block text-2xl font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>64.9</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-red-600 font-bold text-sm">HIGH PRESSURE</h3>
                    <p className="text-xs text-slate-400 mt-1">▲ 22.7 pts in 24h<br/>Intra-week price volatility dispersion: 11%</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="text-[11px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded font-semibold border border-orange-100">
                    RBI watch • MODERATE_INFLATIONARY_PRESSURE
                  </span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-sm border transition-shadow flex flex-col justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Data Trust Score</span>
                  <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-1 rounded-full border border-emerald-100 font-medium">EXCELLENT</span>
                </div>
                <div className="flex items-center gap-5 mt-3">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center border-t-emerald-500 border-r-emerald-500 border-b-emerald-500 relative flex-shrink-0">
                    <div className="text-center">
                      <span className={`block text-2xl font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>95.1</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-col gap-1 w-full">
                    <div className="flex justify-between"><span>Coverage</span> <span className="font-medium text-slate-300">100%</span></div>
                    <div className="flex justify-between"><span>Freshness</span> <span className="font-medium text-slate-300">100%</span></div>
                    <div className="flex justify-between"><span>Consensus</span> <span className="font-medium text-slate-300">96.5</span></div>
                  </div>
                </div>
                <div className={`mt-4 text-[10px] text-slate-400 break-all p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  SHA-256 hashed • 2026-09-04
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-5">Executive Intelligence</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1st REAL CHART (Home Tab) */}
                <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm border min-h-[350px] flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        National Airfare Index Trend
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Live data from API • Hover to view details</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 text-xs bg-slate-100 rounded text-slate-600 font-semibold shadow-inner">7D</button>
                      <button className={`px-4 py-1.5 text-xs border rounded font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>1M</button>
                    </div>
                  </div>
                  
                  <div className={`w-full flex-1 rounded pt-4 pb-2 pr-4 border-t ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-b from-indigo-50/20 to-white border-indigo-100/50'}`}>
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'}/>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10}/>
                          <YAxis domain={[80, 150]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dx={-10}/>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}
                            labelStyle={{ fontWeight: 'bold', color: isDarkMode ? '#f1f5f9' : '#0f172a', marginBottom: '4px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="national" name="National Avg" stroke={isDarkMode ? '#ffffff' : '#000000'} strokeWidth={3} dot={false} strokeDasharray="5 5" />
                          <Line type="monotone" dataKey="t1" name="T+1 (Spot)" stroke="#ef4444" strokeWidth={2} dot={{r: 2}} activeDot={{r: 5}} />
                          <Line type="monotone" dataKey="t7" name="T+7" stroke="#f97316" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t15" name="T+15" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t30" name="T+30" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t45" name="T+45 (Early)" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                        <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Connecting to FastAPI Data Engine...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Route Intelligence</h3>
                      <p className="text-xs text-slate-400 mt-1">Largest composite movements</p>
                    </div>
                    <a href="#" className="text-xs text-indigo-400 font-semibold hover:underline">View all routes →</a>
                  </div>
                  <div>
                    <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded font-semibold border border-red-100">
                      ▲ Rising corridors
                    </span>
                    <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">NEW BOM-DEL</p>
                            <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>MUM ➔ NEW</p>
                        </div>
                        <div className="bg-red-50 text-red-600 text-xs px-2.5 py-1.5 rounded font-semibold">
                            ▲ +19.9%
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ROUTES */}
        {activeTab === 'routes' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="mb-12">
              <h1 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Routes</h1>
              <p className="text-sm text-slate-400 mb-6">All routes in the basket. Select a row to open the route detail.</p>
              
              <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <table className="w-full text-sm text-left text-slate-400">
                  <thead className={`text-xs uppercase border-b ${isDarkMode ? 'bg-slate-900/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-4 font-semibold">Code</th>
                      <th className="px-6 py-4 font-semibold">City pair</th>
                      <th className="px-6 py-4 font-semibold text-right">Weight ↓</th>
                      <th className="px-6 py-4 font-semibold text-right">Latest index</th>
                      <th className="px-6 py-4 font-semibold text-center">WoW</th>
                      <th className="px-6 py-4 font-semibold text-center">MoM</th>
                      <th className="px-6 py-4 font-semibold text-right">30-day obs</th>
                      <th className="px-6 py-4 font-semibold text-right">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routesData.map((route, idx) => (
                      <tr key={idx} className={`border-b transition-colors cursor-pointer ${isDarkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{route.code}</td>
                        <td className="px-6 py-4">{route.pair}</td>
                        <td className="px-6 py-4 text-right">{route.weight}</td>
                        <td className={`px-6 py-4 text-right font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{route.index}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${route.wow.includes('+') ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {route.wow}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${route.mom.includes('+') ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {route.mom}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">{route.obs}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                            {route.coverage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Advance Horizons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {['T+1', 'T+7', 'T+15', 'T+30', 'T+45'].map((horizon, idx) => (
                  <div key={idx} className={`p-5 rounded-xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-base mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{horizon}</h3>
                    <p className="text-[11px] text-slate-400 mb-4">National index filtered to bookings made {horizon.split('+')[1]} days before departure.</p>
                    
                    <div className="relative h-[120px] ml-6 border-b border-l border-slate-200/80 mb-2 mt-4" style={{ width: 'calc(100% - 24px)'}}>
                      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path 
                          d="M0,60 L2,80 L4,45 L6,65 L8,30 L10,75 L12,40 L14,70 L16,35 L18,85 L20,25 L22,60 L24,45 L26,90 L28,30 L30,70 L32,40 L34,80 L36,35 L38,65 L40,20 L42,75 L44,45 L46,85 L48,25 L50,60 L52,35 L54,80 L56,40 L58,70 L60,15 L62,65 L64,85 L66,35 L68,75 L70,25 L72,60 L74,40 L76,85 L78,30 L80,70 L82,45 L84,80 L86,20 L88,65 L90,85 L92,30 L94,75 L96,40 L98,70 L100,50" 
                          fill="none" 
                          stroke="#115e59" 
                          strokeWidth="1.5" 
                          vectorEffect="non-scaling-stroke" 
                        />
                      </svg>
                      <div className="absolute -left-6 top-0 text-[9px] text-slate-400 flex flex-col justify-between h-full py-1">
                        <span>112</span>
                        <span>105</span>
                        <span>98</span>
                        <span>91</span>
                      </div>
                      <div className="absolute -bottom-5 left-0 w-full text-[9px] text-slate-400 flex justify-between px-1">
                        <span>10 Jul</span>
                        <span>27 Jul</span>
                        <span>13 Aug</span>
                        <span>01 Sept</span>
                        <span>22 Sept</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: AIRLINES */}
        {activeTab === 'airlines' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            
            <div className={`flex justify-between items-start lg:items-center mb-6 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Airline Intelligence</h1>
                <p className="text-base text-slate-400 mt-1">Carrier analytics, OTA aggregators, and channel health monitoring.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                {/* LIVE DYNAMIC TIME */}
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">🕒</span> {formattedTime}
                </div>
                {/* LIVE DYNAMIC DATE */}
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">📅</span> Data as of {formattedDate}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Carrier analytics
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">real quote aggregates</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                      <thead className={`text-xs uppercase border-y ${isDarkMode ? 'bg-slate-900/50 text-slate-400 border-slate-700' : 'bg-slate-50/50 text-slate-400 border-slate-100'}`}>
                        <tr>
                          <th className="px-4 py-3">Airline</th>
                          <th className="px-4 py-3 text-right">Avg Fare</th>
                          <th className="px-4 py-3 text-center">Change</th>
                          <th className="px-4 py-3 text-center">Share</th>
                          <th className="px-4 py-3 text-right">Quotes 30D</th>
                          <th className="px-4 py-3 text-right">Volatility</th>
                          <th className="px-4 py-3 text-center">Signal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrierData.map((carrier, idx) => (
                          <tr key={idx} className={`border-b transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50/50'}`}>
                            <td className="px-4 py-4 flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${carrier.color}`}>
                                {carrier.code}
                              </div>
                              <div>
                                <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{carrier.name}</span>
                                <span className="ml-2 text-[10px] text-slate-400 font-medium">{carrier.type}</span>
                              </div>
                            </td>
                            <td className={`px-4 py-4 text-right font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{carrier.fare}</td>
                            <td className="px-4 py-4 text-center">
                              {carrier.changeType === 'up' && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold">
                                  ▲ {carrier.change}
                                </span>
                              )}
                              {carrier.changeType === 'down' && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold">
                                  ▼ {carrier.change}
                                </span>
                              )}
                              {carrier.changeType === 'neutral' && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">
                                  {carrier.change}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 justify-center">
                                <div className={`w-16 h-1.5 rounded-full overflow-hidden flex ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                  <div className={`h-full ${carrier.color}`} style={{ width: `${carrier.share}%` }}></div>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 w-8">{carrier.share}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right text-cyan-600 font-medium">{carrier.quotes}</td>
                            <td className="px-4 py-4 text-right text-slate-400 font-medium">{carrier.vol}</td>
                            <td className="px-4 py-4 text-center">
                              {carrier.sigType === 'up' && (
                                <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-[11px] font-bold">
                                  {carrier.signal}
                                </span>
                              )}
                              {carrier.sigType === 'down' && (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[11px] font-bold">
                                  {carrier.signal}
                                </span>
                              )}
                              {carrier.sigType === 'neutral' && (
                                <span className="bg-slate-50 text-slate-400 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-bold">
                                  {carrier.signal}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              <div className="space-y-6">
                
                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="mb-5">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                      OTA aggregators
                    </h3>
                  </div>
                  
                  <div className="flex flex-col">
                    {otaData.map((ota, idx) => (
                      <div key={idx} className={`flex justify-between items-center py-3 border-b last:border-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                        <div className="flex items-center gap-3">
                           <span className="bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded text-[11px] font-bold border border-cyan-100 tracking-wide">OTA</span>
                           <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{ota.name}</span>
                        </div>
                        <div className="text-right">
                           <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ota.fare}</div>
                           <div className="text-[10px] text-slate-400">{ota.quotes} quotes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="mb-5">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                      Channel health (today)
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {channelHealth.map((channel, idx) => (
                      <div key={idx} className={`flex justify-between items-center py-2 border-b last:border-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                        <div className="flex items-center gap-3 w-1/3">
                          <span className={`w-2 h-2 rounded-full ${channel.status}`}></span>
                          <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{channel.name}</span>
                        </div>
                        <div className="w-1/3 text-right">
                          <span className="text-xs text-slate-400">{channel.quotes} quotes</span>
                        </div>
                        <div className="w-1/3 text-right">
                          {channel.type === 'up' && (
                            <span className="inline-flex bg-red-50 text-red-600 px-2 py-0.5 rounded text-[11px] font-bold">
                              ▲ {channel.change}
                            </span>
                          )}
                          {channel.type === 'down' && (
                            <span className="inline-flex bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold">
                              ▼ {channel.change}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: BOOKING WINDOWS */}
        {activeTab === 'booking' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            
            <div className={`flex justify-between items-start lg:items-center mb-6 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Booking Window Analysis</h1>
                <p className="text-base text-slate-400 mt-1">Advance-purchase horizons, yield curve & day-of-week dynamics.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                {/* LIVE DYNAMIC TIME */}
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">🕒</span> {formattedTime}
                </div>
                {/* LIVE DYNAMIC DATE */}
                <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-slate-400">📅</span> Data as of {formattedDate}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="bg-cyan-50 text-cyan-700 font-semibold text-xs px-3 py-1.5 rounded-full border border-cyan-100 flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 elasticity • temporal engine
              </div>
              <button className="flex items-center gap-2 text-slate-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm shadow-sm border border-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Refresh
              </button>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border mb-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Airfare by booking window
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">National average fare by advance horizon — click-through weight structure</p>
                </div>
                <div className="bg-red-50 text-red-600 font-semibold text-xs px-3 py-1 rounded-full border border-red-100">
                  Priciest: T+1
                </div>
              </div>

              <div className={`flex justify-around items-end h-[220px] px-8 border-b pb-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex flex-col items-center w-1/6 group cursor-pointer">
                  <span className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>₹13,794</span>
                  <div className="w-full bg-[#ef4444] rounded-t-lg h-[180px] shadow-sm group-hover:bg-red-600 transition-colors"></div>
                </div>
                <div className="flex flex-col items-center w-1/6 group cursor-pointer">
                  <span className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>₹10,444</span>
                  <div className="w-full bg-[#f59e0b] rounded-t-lg h-[140px] shadow-sm group-hover:bg-amber-600 transition-colors"></div>
                </div>
                <div className="flex flex-col items-center w-1/6 group cursor-pointer">
                  <span className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>₹6,542</span>
                  <div className="w-full bg-[#6366f1] rounded-t-lg h-[90px] shadow-sm group-hover:bg-indigo-600 transition-colors"></div>
                </div>
                <div className="flex flex-col items-center w-1/6 group cursor-pointer">
                  <span className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>₹6,844</span>
                  <div className="w-full bg-[#6366f1] rounded-t-lg h-[95px] shadow-sm group-hover:bg-indigo-600 transition-colors"></div>
                </div>
                <div className="flex flex-col items-center w-1/6 group cursor-pointer">
                  <span className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>₹5,512</span>
                  <div className="w-full bg-[#6366f1] rounded-t-lg h-[75px] shadow-sm group-hover:bg-indigo-600 transition-colors"></div>
                </div>
              </div>

              <div className="flex justify-around mt-4 px-8">
                <div className="text-center w-1/6"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>T+1</p><p className="text-[10px] text-slate-400 leading-tight mt-1">Spot / Emergency<br/>wt 22%</p></div>
                <div className="text-center w-1/6"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>T+7</p><p className="text-[10px] text-slate-400 leading-tight mt-1">Urgent Business<br/>wt 34%</p></div>
                <div className="text-center w-1/6"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>T+15</p><p className="text-[10px] text-slate-400 leading-tight mt-1">Standard Planned<br/>wt 24%</p></div>
                <div className="text-center w-1/6"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>T+30</p><p className="text-[10px] text-slate-400 leading-tight mt-1">Planned Leisure<br/>wt 14%</p></div>
                <div className="text-center w-1/6"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>T+45</p><p className="text-[10px] text-slate-400 leading-tight mt-1">Early Bird<br/>wt 6%</p></div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-8">
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">T+1 SUB-INDEX • SPOT / EMERGENCY</h4>
                  <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>110.19</p>
                  <p className="text-[10px] text-slate-400">92 cells • ₹13,794 avg</p>
                </div>
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">T+7 SUB-INDEX • URGENT BUSINESS</h4>
                  <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>124.04</p>
                  <p className="text-[10px] text-slate-400">92 cells • ₹10,444 avg</p>
                </div>
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">T+15 SUB-INDEX • STANDARD PLANNED</h4>
                  <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>102.47</p>
                  <p className="text-[10px] text-slate-400">95 cells • ₹6,542 avg</p>
                </div>
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">T+30 SUB-INDEX • PLANNED LEISURE</h4>
                  <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>124.00</p>
                  <p className="text-[10px] text-slate-400">94 cells • ₹6,844 avg</p>
                </div>
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">T+45 SUB-INDEX • EARLY BIRD</h4>
                  <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>107.46</p>
                  <p className="text-[10px] text-slate-400">110 cells • ₹5,512 avg</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="mb-6">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    Day-of-week fare dynamics
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">empirical multipliers • p &lt; 0.001 (ANOVA F-test across Day-of-Week and Booking Horizons validated on 35-day panel)</p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Monday</span>
                      <span className="text-xs text-slate-400 truncate">Morning Business Travel Surge</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-16 h-1.5 bg-red-500 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>+5.0%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Tuesday</span>
                      <span className="text-xs text-slate-400 truncate">Mid-Week Low Demand Trough</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-10 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>-9.0%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Wednesday</span>
                      <span className="text-xs text-slate-400 truncate">Stable Corporate Booking</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-8 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>-4.2%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Thursday</span>
                      <span className="text-xs text-slate-400 truncate">Pre-Weekend Leisure Ramp-up</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-10 h-1.5 bg-amber-400 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>+1.5%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Friday</span>
                      <span className="text-xs text-slate-400 truncate">High Demand Leisure Outbound</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-14 h-1.5 bg-red-400 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>+4.8%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Saturday</span>
                      <span className="text-xs text-slate-400 truncate">Weekend Stability / Low Corporate</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-10 h-1.5 bg-emerald-300 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>-3.5%</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-24 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Sunday</span>
                      <span className="text-xs text-slate-400 truncate">Return Travel Spike</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-16 h-1.5 bg-red-500 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>+6.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="mb-6">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Advance booking yield curve
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">average multiplier over base fare</p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>T+1</span>
                      <span className="text-xs text-slate-400 truncate">Spot Emergency (&lt;24h)</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-20 h-1.5 bg-red-500 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>2.58x</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>T+7</span>
                      <span className="text-xs text-slate-400 truncate">Urgent Corporate (7d)</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-12 h-1.5 bg-orange-400 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>1.65x</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>T+15</span>
                      <span className="text-xs text-slate-400 truncate">Standard Planned (15d)</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-8 h-1.5 bg-indigo-400 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>1.25x</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>T+30</span>
                      <span className="text-xs text-slate-400 truncate">Planned Leisure (30d)</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-6 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>1.10x</span>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                    <div className="flex gap-4 items-center w-2/3">
                      <span className={`font-bold w-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>T+45</span>
                      <span className="text-xs text-slate-400 truncate">Early Bird Baseline (45d+)</span>
                    </div>
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                      <div className="w-4 h-1.5 bg-slate-300 rounded-full"></div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>1.00x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 5: HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            
            <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Geospatial Airfare Heatmap</h1>
                <p className="text-base text-slate-400 mt-1">Real-time visualization of route inflation and index variations across India.</p>
              </div>
              
              <div className="flex gap-2">
                <button className={`border px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                  Filter Routes
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              <div className={`w-full lg:w-96 rounded-xl border z-10 p-6 flex flex-col shadow-sm shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold text-xl mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Route Hotspots</h3>
                <div className="space-y-4 flex-1">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-red-700 text-base">DEL ➔ CCU</span>
                      <span className="text-red-700 font-bold text-sm">+12.4%</span>
                    </div>
                    <p className="text-xs text-red-600/80">High Inflation Zone</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-red-700 text-base">DEL ➔ BOM</span>
                      <span className="text-red-700 font-bold text-sm">+8.2%</span>
                    </div>
                    <p className="text-xs text-red-600/80">High Inflation Zone</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-orange-700 text-base">DEL ➔ BLR</span>
                      <span className="text-orange-700 font-bold text-sm">+4.4%</span>
                    </div>
                    <p className="text-xs text-orange-600/80">Moderate Rise</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-700 text-base">BOM ➔ HYD</span>
                      <span className="text-emerald-700 font-bold text-sm">-1.1%</span>
                    </div>
                    <p className="text-xs text-emerald-600/80">Stable Route</p>
                  </div>
                </div>

                <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase">Legend</h4>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 mb-2">
                    <span className="w-4 h-4 rounded-full bg-red-500"></span> High Inflation (&gt;8%)
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 mb-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500"></span> Moderate (3-8%)
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500"></span> Stable (&lt;3%)
                  </div>
                </div>
              </div>

              <div className={`flex-1 rounded-xl overflow-hidden relative border shadow-sm w-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                <div className="relative w-full">
                  <img src="/map.jpg" alt="India Map" className="w-full h-auto block opacity-90" />
                  <div className="absolute inset-0">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {mapRoutes.map((route, i) => {
                        const fromNode = mapLocations.find(loc => loc.code === route.from);
                        const toNode = mapLocations.find(loc => loc.code === route.to);
                        if(!fromNode || !toNode) return null;
                        
                        return (
                          <line 
                            key={i}
                            x1={`${fromNode.x}%`} 
                            y1={`${fromNode.y}%`} 
                            x2={`${toNode.x}%`} 
                            y2={`${toNode.y}%`} 
                            stroke={route.color} 
                            strokeWidth="2" 
                            strokeDasharray={route.dashed ? "5 3" : "none"}
                          />
                        );
                      })}
                    </svg>
                    {mapLocations.map((loc, i) => {
                      let colorClass = "bg-teal-600";
                      let textClass = "text-emerald-600";
                      if(loc.status === 'high') { colorClass = "bg-indigo-500"; textClass = "text-red-600"; }
                      if(loc.status === 'moderate') { colorClass = "bg-teal-600"; textClass = "text-orange-600"; }

                      return (
                        <div 
                          key={i}
                          className="absolute flex flex-col items-center group cursor-pointer"
                          style={{ top: `${loc.y}%`, left: `${loc.x}%`, transform: 'translate(-50%, -50%)' }}
                        >
                          <div className={`${colorClass} text-white p-1.5 rounded-full shadow-md z-20 hover:scale-110 transition-transform`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                          </div>
                          
                          <div className={`px-2 py-1 rounded shadow-md mt-1 border z-30 opacity-95 text-center min-w-[50px] ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                            <p className="text-[10px] font-bold leading-tight">{loc.code}</p>
                            <p className={`text-[9px] font-bold ${textClass} leading-tight`}>Idx {loc.idx}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 6: AIRFARE INDEX WITH REAL CHART */}
        {activeTab === 'airfare' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            
            <div className={`flex justify-between items-start lg:items-center mb-6 border-b pb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Real-Time Airfare CPI Index</h1>
                <p className="text-base text-slate-400 mt-1">Live superlative calculation and MoSPI benchmark tracking.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-full shadow-sm border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live Stream Active
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              
              <div className="lg:col-span-1 space-y-6">
                
                {/* The CPI Calculation Formula */}
                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <span className="text-xl">📊</span> The CPI Calculation Formula
                  </h3>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      
                      <div className={`flex flex-col items-center justify-center gap-2 mb-4 font-serif overflow-x-auto ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <div className="flex items-center gap-3 text-sm md:text-base font-bold whitespace-nowrap">
                          <span>CPI =</span>
                          <span className="flex items-center text-lg">
                            ( ∑ ( <span className="flex flex-col items-center justify-center mx-1 text-sm"><span className="border-b border-slate-800 px-1">Current Price</span><span>Base Year Price</span></span> × Weight ) ) × 100
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm md:text-base font-bold whitespace-nowrap mt-2">
                          <span className="text-slate-400 mx-2 text-sm italic">or</span>
                          <span className="flex items-center gap-1 text-lg">
                             <span className="flex flex-col items-center justify-center"><span className="border-b border-slate-800 px-1">∑(P<sub>1i</sub> · W<sub>i</sub>)</span><span>∑(P<sub>0i</sub> · W<sub>i</sub>)</span></span> × 100
                          </span>
                        </div>
                      </div>
                      
                      <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4 border-t border-slate-700 pt-3">
                        <li><strong className={`font-serif text-[13px] ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>P<sub>1i</sub>:</strong> Current period price for item i (including airfare or transport services).</li>
                        <li><strong className={`font-serif text-[13px] ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>P<sub>0i</sub>:</strong> Base year reference price for item i (2024 = 100).</li>
                        <li><strong className={`font-serif text-[13px] ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>W<sub>i</sub>:</strong> Expenditure weight assigned to item i derived from the Household Consumption Expenditure Survey (HCES).</li>
                      </ul>

                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                   <h3 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>MoSPI Bulletin Export</h3>
                   <div className="flex gap-2 mb-4">
                     <button className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded shadow-sm hover:bg-slate-800 transition-colors">CSV DATA</button>
                     <button className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded shadow-sm hover:bg-indigo-700 transition-colors">PDF REPORT</button>
                   </div>
                   <div className={`p-2 rounded border break-all ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                     <p className="text-[9px] text-slate-400 font-mono uppercase">Live Integrity Hash (SHA-256)</p>
                     <p className="text-[10px] text-slate-400 font-mono font-semibold mt-1">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
                   </div>
                </div>

              </div>

              <div className="lg:col-span-2 space-y-6">
                
                <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Real-Time Sub-Indices</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                      <thead className={`text-xs uppercase border-b ${isDarkMode ? 'bg-slate-900/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        <tr>
                          <th className="px-4 py-3 font-semibold">Corridor Category</th>
                          <th className="px-4 py-3 font-semibold text-right">DGCA Wt</th>
                          <th className="px-4 py-3 font-semibold text-right">Live Index</th>
                          <th className="px-4 py-3 font-semibold text-center">24H Move</th>
                          <th className="px-4 py-3 font-semibold text-center">CPI Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {airfareCategories.map((cat, idx) => (
                          <tr key={idx} className={`border-b transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50/50'}`}>
                            <td className={`px-4 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{cat.category}</td>
                            <td className="px-4 py-3 text-right">{cat.weight}</td>
                            <td className={`px-4 py-3 text-right font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{cat.index}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${cat.wow.includes('+') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {cat.wow}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{cat.rtc}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2nd REAL CHART (Airfare Tab) */}
                <div className={`p-6 rounded-2xl shadow-sm border h-[300px] flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Historical Inflation Series vs CPI Benchmark</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-3 h-1 bg-indigo-600 rounded"></span> Airfare Index</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-1 bg-slate-300 rounded"></span> Base CPI</span>
                    </div>
                  </div>
                  
                  {/* Fixed Recharts Container */}
                  <div className={`flex-1 rounded border flex items-center justify-center relative overflow-hidden pt-4 pb-2 pr-4 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'}/>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10}/>
                          <YAxis domain={[80, 150]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dx={-10}/>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}
                            labelStyle={{ fontWeight: 'bold', color: isDarkMode ? '#f1f5f9' : '#0f172a', marginBottom: '4px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          
                          {/* National Average (Dotted Line) */}
                          <Line type="monotone" dataKey="national" name="National Avg" stroke={isDarkMode ? '#ffffff' : '#000000'} strokeWidth={3} dot={false} strokeDasharray="5 5" />
                          
                          {/* T+ Horizons (5 Different colors) */}
                          <Line type="monotone" dataKey="t1" name="T+1 (Spot)" stroke="#ef4444" strokeWidth={2} dot={{r: 2}} activeDot={{r: 5}} />
                          <Line type="monotone" dataKey="t7" name="T+7" stroke="#f97316" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t15" name="T+15" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t30" name="T+30" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="t45" name="T+45 (Early)" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                        <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Loading Backend Graph Data...</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
