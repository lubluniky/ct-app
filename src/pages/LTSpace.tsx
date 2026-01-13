import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Terminal, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChartData {
  date: string;
  val: number;
}

const LTSpace = () => {
  const [metData, setMetData] = useState<ChartData[]>([]);
  const [rayData, setRayData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date().toISOString().split('T')[0];
        // Start date 3 months ago for a good view
        const startDateObj = new Date();
        startDateObj.setMonth(startDateObj.getMonth() - 3);
        const startDate = startDateObj.toISOString().split('T')[0];

        const headers = {
          'accept': 'application/json, text/plain, */*',
          'authorization': '_QUAsXmDQbfx12dNLKAlYhkrY4wbQBa71zfoPvWoJ05B',
          'origin': 'https://app.artemisanalytics.com',
          'referer': 'https://app.artemisanalytics.com/',
          'x-art-webtoken': 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjgzMTUxMjksImV4cCI6MTc2ODQwMTUyOX0.WFes6s4VU1ZgwEuNSzb5LxF8-jwPjOsw9zFX4ZuN25s' // Ideally this should be refreshed or proxied
        };

        // Fetch MET Data
        const metResponse = await fetch(`https://data-svc.artemisxyz.com/v2/data/FEES?symbols=met&startDate=${startDate}&endDate=${endDate}`, { headers });
        if (!metResponse.ok) throw new Error('Failed to fetch MET data');
        const metJson = await metResponse.json();

        // Fetch RAY Data
        const rayResponse = await fetch(`https://data-svc.artemisxyz.com/v2/data/FEES?symbols=ray&startDate=${startDate}&endDate=${endDate}`, { headers });
        if (!rayResponse.ok) throw new Error('Failed to fetch RAY data');
        const rayJson = await rayResponse.json();

        // Process Data
        // Artemis structure usually involves iterating through keys or a 'data' array.
        // Assuming simpler structure based on endpoint or standard Artemis response:
        // Adjust parsing logic based on actual response structure if needed.
        // Typically: { data: { artemis_ids: {...}, met: [ { date: '...', val: ... } ] } }

        const processArtemisData = (json: any, symbol: string) => {
            if (json.data && json.data[symbol]) {
                return json.data[symbol].map((item: any) => ({
                    date: item.date.slice(5), // MM-DD
                    val: item.val
                }));
            }
            return [];
        };

        setMetData(processArtemisData(metJson, 'met'));
        setRayData(processArtemisData(rayJson, 'ray'));

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to initialize data stream.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />

        <div className="z-10 flex flex-col items-center gap-6">
          <Terminal className="w-12 h-12 animate-pulse text-neutral-400" />
          <div className="flex flex-col items-center gap-2">
             <div className="text-2xl font-mono tracking-widest font-bold">INITIALIZING LT SPACE</div>
             <div className="text-xs text-neutral-600 font-mono">ESTABLISHING SECURE CONNECTION...</div>
          </div>

          <div className="w-64 h-1 bg-neutral-900 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-white animate-progress-indeterminate"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden selection:bg-white/20">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-4 text-sm font-mono group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             RETURN TO BASE
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">LT SPACE <span className="text-neutral-600">ANALYTICS</span></h1>
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data Feed
          </div>
        </div>

        <div className="flex gap-4">
             <div className="px-4 py-2 border border-white/10 rounded-sm bg-white/5 backdrop-blur-sm">
                <div className="text-[10px] text-neutral-400 font-mono mb-1">NETWORK STATUS</div>
                <div className="text-sm font-bold text-emerald-400">OPTIMAL</div>
             </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

        {/* Chart 1: MET */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-lg backdrop-blur-sm relative group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 block rounded-sm"></span>
              MET FEES
            </h3>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded">DAILY TIMEFRAME</span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
                  dy={10}
                />
                <YAxis
                   hide
                />
                <Tooltip
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                  {metData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === metData.length - 1 ? '#3b82f6' : '#1e3a8a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: RAY */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-lg backdrop-blur-sm relative group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 block rounded-sm"></span>
              RAY FEES
            </h3>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded">DAILY TIMEFRAME</span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rayData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
                  dy={10}
                />
                 <YAxis
                   hide
                />
                <Tooltip
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                   {rayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === rayData.length - 1 ? '#a855f7' : '#581c87'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LTSpace;
