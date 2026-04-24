import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Users, Clock, Activity, Flame, TrendingUp, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../utils/api";

interface ClassTemplate {
  id: number;
  name: string;
  type: string;
  duration: number;
  intensity: string;
  description: string;
  image: string;
}

interface GymClass {
  id: number;
  room: string;
  class_date: string;
  start_time: string;
  max_capacity: number;
  bookings_count: number;
  trainer?: { first_name: string; last_name: string };
}

interface AnalyticsData {
  last_7_days: number;
  last_30_days: number;
  last_365_days: number;
}

export function AdminBookings() {
  const [templates, setTemplates] = useState<ClassTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ClassTemplate | null>(null);
  const [activeSchedules, setActiveSchedules] = useState<GymClass[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/admin/bookings');
        setTemplates(res.data.templates);
        if (res.data.templates.length > 0) {
          loadTemplateDetails(res.data.templates[0]);
        }
      } catch (error) {
        console.error("Failed to load classes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const loadTemplateDetails = async (template: ClassTemplate) => {
    setSelectedTemplate(template);
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/bookings/analytics/${template.id}`);
      setActiveSchedules(res.data.schedules);
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-orange-500" /> Class Analytics & Timetable
        </h1>
        <p className="text-sm text-gray-400 mt-1">View attendance performance and the fixed weekly schedule.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* --- LEFT SIDEBAR: THE CATALOGUE MENU --- */}
        <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-black/20">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Fixed Class Catalogue</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="sidebar-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={`sidebar-skel-${i}`} className="w-full p-3 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-800 animate-pulse shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="sidebar-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {templates.map(template => (
                    <button key={template.id} onClick={() => loadTemplateDetails(template)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${selectedTemplate?.id === template.id ? 'bg-orange-500/10 border border-orange-500/30 text-white' : 'border border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                      <div className={`w-10 h-10 rounded-md bg-cover bg-center shrink-0 ${!template.image && 'bg-gray-800'}`} style={{ backgroundImage: `url(${template.image})` }}>
                        {!template.image && <Flame className="w-5 h-5 text-gray-500 m-2.5" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate text-sm">{template.name}</p>
                        <p className="text-xs opacity-70 truncate">{template.type} • {template.duration}m</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT PANEL: THE COMMAND CENTER --- */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {(loading || detailLoading) ? (
              <motion.div key="main-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Hero Image Skeleton */}
                <div className="h-48 bg-gray-800 animate-pulse relative">
                   <div className="absolute bottom-0 left-0 p-6 space-y-3 w-full">
                     <div className="flex gap-2"><div className="h-4 bg-gray-700 rounded w-16"></div><div className="h-4 bg-gray-700 rounded w-24"></div></div>
                     <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                     <div className="h-3 bg-gray-700 rounded w-1/2 mt-2"></div>
                   </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Analytics Skeleton */}
                  <div>
                    <div className="h-4 bg-gray-800 rounded w-40 animate-pulse mb-4"></div>
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={`stat-skel-${i}`} className="bg-black/40 border border-gray-800 rounded-xl p-5 h-24 flex flex-col justify-center gap-2">
                           <div className="h-3 bg-gray-800 rounded w-24 animate-pulse"></div>
                           <div className="h-8 bg-gray-800 rounded w-16 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table Skeleton */}
                  <div>
                    <div className="h-4 bg-gray-800 rounded w-32 animate-pulse mb-4"></div>
                    <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
                       <div className="h-10 bg-gray-900/80 border-b border-gray-800"></div>
                       {[...Array(4)].map((_, i) => (
                         <div key={`row-skel-${i}`} className="h-14 border-b border-gray-800/50 flex items-center px-4 gap-4">
                           <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
                           <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
                           <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
                           <div className="h-5 bg-gray-800 rounded w-16 animate-pulse"></div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : selectedTemplate ? (
              <motion.div key="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="h-48 relative bg-cover bg-center" style={{ backgroundImage: `url(${selectedTemplate.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase">{selectedTemplate.type}</span>
                      <span className="bg-black/50 backdrop-blur-md text-gray-300 px-2 py-0.5 rounded text-xs font-bold uppercase border border-gray-700">{selectedTemplate.intensity} Intensity</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedTemplate.name}</h2>
                    <p className="text-gray-300 mt-1 max-w-2xl text-sm">{selectedTemplate.description}</p>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* ANALYTICS ROW */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-500"/> Attendance Analytics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-black/40 border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <p className="text-sm text-gray-500 font-medium">Last 7 Days</p>
                        <p className="text-3xl font-bold text-white mt-1">{analytics?.last_7_days || 0}</p>
                      </div>
                      <div className="bg-black/40 border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                        <p className="text-sm text-gray-500 font-medium">Last 30 Days</p>
                        <p className="text-3xl font-bold text-white mt-1">{analytics?.last_30_days || 0}</p>
                      </div>
                      <div className="bg-black/40 border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <p className="text-sm text-gray-500 font-medium">Last 365 Days</p>
                        <p className="text-3xl font-bold text-white mt-1">{analytics?.last_365_days || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* THE FIXED TIMETABLE */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-4"><CalendarIcon className="w-4 h-4 text-orange-500"/> Fixed Timetable</h3>
                    <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-gray-400">
                          <tr>
                            <th className="px-4 py-3 font-medium">Schedule</th>
                            <th className="px-4 py-3 font-medium">Trainer</th>
                            <th className="px-4 py-3 font-medium">Room</th>
                            <th className="px-4 py-3 font-medium">Live Bookings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {activeSchedules.map((schedule) => {
                            const isFull = schedule.bookings_count >= schedule.max_capacity;
                            return (
                              <tr key={schedule.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="text-white font-medium">{new Date(schedule.class_date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                  <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> {formatTime(schedule.start_time)}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-300">{schedule.trainer?.first_name} {schedule.trainer?.last_name}</td>
                                <td className="px-4 py-3 text-gray-400"><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {schedule.room}</span></td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    <Users className="w-3 h-3"/> {schedule.bookings_count} / {schedule.max_capacity}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a class from the catalogue to view analytics.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}