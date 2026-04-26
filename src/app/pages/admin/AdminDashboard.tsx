import { useEffect, useState } from "react";
import { Users, CalendarDays, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import api from "../../../config/api";
import { AdminLoader } from "../../components/admin/AdminLoader";

// Update the interface to expect the new chart_data from Laravel
interface DashboardData {
  total_members: number;
  total_bookings: number;
  bookings_today: number;
  recent_bookings: Array<{
    id: number;
    name: string;
    class_name: string;
    schedule_day: string;
    schedule_time: string;
    created_at: string;
  }>;
  chart_data: {
    week: Array<{ name: string; bookings: number }>;
    month: Array<{ name: string; bookings: number }>;
    year: Array<{ name: string; bookings: number }>;
  };
}

type TimeRange = "week" | "month" | "year";

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  useEffect(() => {
// 🔥 THE FIX: Add /api to the route
      api.get("/api/admin/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-40 bg-gray-800/80 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* 1. Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <div className="w-24 h-6 bg-gray-800 rounded-full"></div>
              </div>
              <div className="w-16 h-8 bg-gray-800 rounded-lg mb-2"></div>
              <div className="w-32 h-4 bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* 2. Chart Skeleton */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="w-full sm:w-auto">
              <div className="h-6 w-48 bg-gray-800 rounded-lg mb-2"></div>
              <div className="h-4 w-64 bg-gray-800/80 rounded-lg"></div>
            </div>
            <div className="w-full sm:w-48 h-8 bg-gray-800 rounded-lg"></div>
          </div>
          <div className="h-[300px] w-full bg-gray-800/30 rounded-lg"></div>
        </div>

        {/* 3. Table Skeleton */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
          <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/50">
            <div className="h-6 w-40 bg-gray-800 rounded-lg"></div>
          </div>
          <div className="p-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 px-5 py-5 border-b border-gray-800/50">
                <div className="h-4 w-1/4 bg-gray-800 rounded-lg"></div>
                <div className="h-4 w-1/4 bg-gray-800 rounded-lg"></div>
                <div className="h-4 w-1/4 bg-gray-800 rounded-lg"></div>
                <div className="h-6 w-24 bg-gray-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-6 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>;
  if (!data) return null;

  const stats = [
    { 
      label: "Total Members", 
      value: data.total_members, 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10",
      trend: "+12% this month", // You can automate these later!
      trendUp: true
    },
    { 
      label: "Total Bookings", 
      value: data.total_bookings, 
      icon: CalendarDays, 
      color: "text-orange-400", 
      bg: "bg-orange-500/10",
      trend: "+5% this week",
      trendUp: true
    },
    { 
      label: "Bookings Today", 
      value: data.bookings_today, 
      icon: TrendingUp, 
      color: "text-green-400", 
      bg: "bg-green-500/10",
      trend: "Real-time updates",
      trendUp: true
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 font-medium">Real-time gym metrics</p>
      </div>

      {/* --- 1. Top Row: Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, trend, trendUp }, i) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${bg} p-3 rounded-lg border border-white/5`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- 2. Middle Section: REAL Database Chart --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Booking Analytics</h2>
            <p className="text-sm text-gray-400">Class attendance trends over time</p>
          </div>
          <div className="flex bg-black/50 p-1 rounded-lg border border-gray-800">
            {(["week", "month", "year"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  timeRange === range 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {range === "week" ? "7 Days" : `This ${range}`}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {/* Added a safety check: Only render the chart IF chart_data exists */}
            {data.chart_data ? (
              <BarChart data={data.chart_data[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1F2937' }}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#ea580c', fontWeight: 'bold' }}
                />
                <Bar dataKey="bookings" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                Fetching Data...
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* --- 3. Bottom Section: Recent Bookings Table --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-white">Recent Bookings</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4 font-semibold">Member Name</th>
                <th className="text-left px-5 py-4 font-semibold">Class</th>
                <th className="text-left px-5 py-4 font-semibold">Schedule</th>
                <th className="text-left px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.recent_bookings.map((b, i) => (
                  <motion.tr 
                    key={b.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <p className="text-white font-medium group-hover:text-orange-400 transition-colors">{b.name}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-medium">{b.class_name}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-white">{b.schedule_day}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="text-gray-400">{b.schedule_time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Confirmed
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              
              {data.recent_bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}