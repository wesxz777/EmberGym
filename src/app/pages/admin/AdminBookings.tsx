import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Users, Clock, Activity, Flame, TrendingUp, MapPin, Plus, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../../config/api";

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

interface Trainer {
  id: number;
  first_name: string;
  last_name: string;
}

export function AdminBookings() {
  const [templates, setTemplates] = useState<ClassTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ClassTemplate | null>(null);
  const [activeSchedules, setActiveSchedules] = useState<GymClass[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // --- NEW: Scheduling Modal State ---
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    trainer_id: "",
    room: "Studio A", // Default
    class_date: "",
    start_time: "",
    end_time: "",
    max_capacity: 20 // Default
  });

  useEffect(() => {
    fetchTemplates();
    fetchTrainers(); // Pre-load the trainers list!
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/api/admin/bookings');
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

  // 🔥 Fetch trainers to populate the dropdown
  const fetchTrainers = async () => {
    try {
      const res = await api.get('/api/admin/staff?role=trainer');
      setTrainers(res.data.staff?.data || []);
    } catch (error) {
      console.error("Failed to load trainers", error);
    }
  };

  const loadTemplateDetails = async (template: ClassTemplate) => {
    setSelectedTemplate(template);
    setDetailLoading(true);
    try {
      const res = await api.get(`/api/admin/bookings/analytics/${template.id}`);
      setActiveSchedules(res.data.schedules);
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 🔥 NEW: Handle submitting the new schedule to the database
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setIsScheduling(true);

    try {
      await api.post('/api/admin/bookings', {
        ...scheduleForm,
        class_template_id: selectedTemplate.id,
      });
      
      setShowScheduleModal(false);
      showToast(`${selectedTemplate.name} was successfully scheduled!`);
      
      // Reset form
      setScheduleForm({ ...scheduleForm, class_date: "", start_time: "", end_time: "" });
      
      // Refresh the page data so the new class appears instantly!
      loadTemplateDetails(selectedTemplate);

    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to schedule class. Check your inputs.");
    } finally {
      setIsScheduling(false);
    }
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-gray-950 border border-green-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-white px-5 py-4 rounded-xl">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0"><Check className="w-5 h-5 text-green-500" /></div>
            <p className="text-sm font-medium pr-4">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="text-gray-500 hover:text-white transition-colors ml-auto"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD SCHEDULE MODAL --- */}
      <AnimatePresence>
        {showScheduleModal && selectedTemplate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => !isScheduling && setShowScheduleModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-orange-500" /> Schedule {selectedTemplate.name}</h3>
                  <button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form id="scheduleForm" onSubmit={handleAddSchedule} className="space-y-4">
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Assign Trainer</label>
                      <select required value={scheduleForm.trainer_id} onChange={e => setScheduleForm({...scheduleForm, trainer_id: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none appearance-none">
                        <option value="" disabled>Select a Trainer...</option>
                        {trainers.map(trainer => (
                          <option key={trainer.id} value={trainer.id}>{trainer.first_name} {trainer.last_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                        <input type="date" required min={new Date().toISOString().split('T')[0]} value={scheduleForm.class_date} onChange={e => setScheduleForm({...scheduleForm, class_date: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Room / Location</label>
                        <select required value={scheduleForm.room} onChange={e => setScheduleForm({...scheduleForm, room: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none appearance-none">
                          <option value="Studio A">Studio A</option>
                          <option value="Studio B">Studio B</option>
                          <option value="Fitness Floor">Fitness Floor</option>
                          <option value="Cycling Studio">Cycling Studio</option>
                          <option value="Weight Room">Weight Room</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Start Time</label>
                        <input type="time" required value={scheduleForm.start_time} onChange={e => setScheduleForm({...scheduleForm, start_time: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">End Time</label>
                        <input type="time" required value={scheduleForm.end_time} onChange={e => setScheduleForm({...scheduleForm, end_time: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Maximum Capacity (Spots)</label>
                      <input type="number" required min="1" max="100" value={scheduleForm.max_capacity} onChange={e => setScheduleForm({...scheduleForm, max_capacity: parseInt(e.target.value) || 1})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" />
                    </div>

                  </form>
                </div>

                <div className="p-5 border-t border-gray-800 bg-gray-950 flex justify-end gap-3 shrink-0">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" form="scheduleForm" disabled={isScheduling} className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isScheduling ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Publish Schedule"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500" /> Class Analytics & Timetable
          </h1>
          <p className="text-sm text-gray-400 mt-1">View attendance performance and the fixed weekly schedule.</p>
        </div>
        {/* 🔥 NEW: The Button to trigger the scheduling modal */}
        {selectedTemplate && (
          <button 
            onClick={() => setShowScheduleModal(true)} 
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" /> Add Schedule
          </button>
        )}
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