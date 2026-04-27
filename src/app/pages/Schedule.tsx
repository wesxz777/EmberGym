import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Dumbbell,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { AuthGate } from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { SCHEDULE } from "../data/gymDatabase"; // 🔥 NEW: Importing your local dummy schedules
import api from "../../config/api"; 

// Define the interface locally so we don't rely on the hardcoded file
export interface ScheduleItem {
  id: number;
  className: string;
  type: string;
  instructor: string;
  time: string;
  day: string;
  duration: number;
  room: string;
  spotsLeft: number;
}

export function Schedule() {
  const { isLoggedIn } = useAuth();
  const { isBooked, bookings, getSpotsLeft } = useBookings();

  // 🔥 NEW: Live Database State
  const [liveSchedule, setLiveSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTime, setSelectedTime] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const scheduleTopRef = useRef<HTMLDivElement>(null);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const types = ["All", "Yoga", "HIIT", "Strength", "Cardio", "Pilates"];
  const times = ["All", "Morning (6-12)", "Afternoon (12-17)", "Evening (17-21)"];

  // 🔥 NEW: Hybrid Fetch Logic
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/api/public/schedule');
        
        // 🔥 HYBRID LOGIC: Check if the live API has data
        if (res.data && res.data.length > 0) {
          // Map the backend data to fit our beautiful frontend UI
          const formatted = res.data.map((c: any) => {
            const dateObj = new Date(c.class_date);
            return {
              id: c.id,
              className: c.template?.name || c.name,
              type: c.template?.type || "Class",
              instructor: c.trainer ? `${c.trainer.first_name} ${c.trainer.last_name}` : "TBA",
              time: c.start_time.substring(0, 5), // '06:00:00' -> '06:00'
              day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
              duration: c.template?.duration || 60,
              room: c.room,
              spotsLeft: c.max_capacity - (c.bookings_count || 0)
            };
          });
          setLiveSchedule(formatted);
        } else {
          // 🔥 FALLBACK: Live database is empty, use dummy data
          console.log("Live DB empty. Falling back to local schedule data.");
          setLiveSchedule(SCHEDULE);
        }
      } catch (error) {
        // 🔥 FALLBACK: API crashed/Render is asleep, use dummy data
        console.error("Failed to load live schedule, falling back to local data.", error);
        setLiveSchedule(SCHEDULE);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchedule();
  }, []);

  // Filter against our LIVE data (which will hold the dummy data if fallback triggered)
  const filteredSchedule = liveSchedule.filter((item) => {
    const dayMatch = selectedDay === "All" || item.day === selectedDay;
    const typeMatch = selectedType === "All" || item.type === selectedType;
    let timeMatch = true;
    if (selectedTime !== "All") {
      const hour = parseInt(item.time.split(":")[0]);
      if (selectedTime === "Morning (6-12)") timeMatch = hour >= 6 && hour < 12;
      else if (selectedTime === "Afternoon (12-17)") timeMatch = hour >= 12 && hour < 17;
      else if (selectedTime === "Evening (17-21)") timeMatch = hour >= 17 && hour <= 21;
    }
    return dayMatch && typeMatch && timeMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSchedule.length / ITEMS_PER_PAGE));
  const paginatedSchedule = filteredSchedule.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startItem = filteredSchedule.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredSchedule.length);

  useEffect(() => { setCurrentPage(1); }, [selectedDay, selectedType, selectedTime]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    scheduleTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isCurrentClass = (item: ScheduleItem) => {
    if (item.day !== currentDay) return false;
    const [hour, minute] = item.time.split(":").map(Number);
    const classStart = hour * 60 + minute;
    const classEnd = classStart + item.duration;
    const currentTime = currentHour * 60 + currentMinute;
    return currentTime >= classStart && currentTime < classEnd;
  };

  const PreviewRows = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
      {liveSchedule.slice(0, 4).map((item) => (
        <div key={item.id} className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{item.className}</h3>
                <span className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1 rounded-full">{item.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /><span>{item.day}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /><span>{item.time} ({item.duration} min)</span></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{item.spotsLeft}</p>
              <p className="text-xs text-gray-400">Spots Left</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Class <span className="text-orange-500">Schedule</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Browse the full weekly timetable. See what's on, check availability, and view your booked sessions.
            </p>
            <Link to="/classes" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/40 transition-all group">
              <Dumbbell className="w-4 h-4" />
              Browse & Book Classes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <AuthGate title="View the Full Schedule" description="Log in to browse all classes, filter by day or type, and see your booked sessions at a glance." preview={<PreviewRows />}>
        {isLoggedIn && bookings.length > 0 && (
          <div className="bg-green-500/5 border-b border-green-500/15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="w-4 h-4" />
                <span>
                  You have <strong>{bookings.length}</strong> class{bookings.length > 1 ? "es" : ""} booked this week.
                  Booked slots are highlighted below.
                </span>
              </div>
              <Link to="/" className="text-xs text-green-500 hover:text-green-300 transition-colors flex items-center gap-1 shrink-0">
                View in My Schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-sm border-b border-orange-500/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Day of Week</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors">
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Class Type</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors">
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Time of Day</label>
                <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors">
                  {times.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" ref={scheduleTopRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 🔥 NEW: Loading Spinner while fetching database */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm">
                    {filteredSchedule.length === 0
                    ? "No classes found"
                    : <>Showing <span className="text-white font-medium">{startItem}–{endItem}</span> of <span className="text-white font-medium">{filteredSchedule.length}</span> {filteredSchedule.length === 1 ? "class" : "classes"}</>
                    }
                </p>
                {totalPages > 1 && (
                    <p className="text-gray-400 text-sm">
                    Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span>
                    </p>
                )}
                </div>

                <AnimatePresence mode="wait">
                <motion.div key={`${currentPage}-${selectedDay}-${selectedType}-${selectedTime}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="space-y-4">
                    {paginatedSchedule.map((item, index) => {
                    const slotBooked = isBooked(item.id);
                    const live = isCurrentClass(item);

                    return (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`bg-gradient-to-br from-gray-900 to-black border rounded-xl p-6 transition-all ${slotBooked ? "border-green-500/40 shadow-md shadow-green-500/5" : live ? "border-orange-500 shadow-lg shadow-orange-500/20" : "border-orange-500/20 hover:border-orange-500/40"}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-xl font-bold">{item.className}</h3>
                                {live && <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE NOW</span>}
                                {slotBooked && <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-500/30"><Check className="w-3 h-3" /> Booked</span>}
                                <span className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1 rounded-full">{item.type}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" />{item.day}</div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" />{item.time} ({item.duration} min)</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" />{item.room}</div>
                                <div><span className="font-medium text-gray-300">Instructor:</span> {item.instructor}</div>
                            </div>
                            </div>
                            <div className="flex items-center gap-5 shrink-0">
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${getSpotsLeft(item.id) <= 5 ? "text-red-400" : "text-orange-500"}`}>{getSpotsLeft(item.id)}</p>
                                <p className="text-xs text-gray-400">Spots Left</p>
                            </div>
                            </div>
                        </div>
                        </motion.div>
                    );
                    })}
                </motion.div>
                </AnimatePresence>

                {filteredSchedule.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="text-5xl mb-4">🗓️</div>
                    <p className="text-xl text-gray-400 mb-2">No classes match your filters.</p>
                    <p className="text-gray-500 mb-6">Try adjusting or clearing your selection.</p>
                    <button onClick={() => { setSelectedDay("All"); setSelectedType("All"); setSelectedTime("All"); }} className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-6 py-2.5 rounded-lg font-medium transition-all">Clear Filters</button>
                </motion.div>
                )}

                {totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-orange-500/30 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-orange-500/10 enabled:hover:border-orange-500/60 enabled:hover:text-orange-400"><ChevronLeft className="w-4 h-4" /> Previous</button>
                    <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((page, idx) => page === "..." ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-500 select-none">…</span> : <button key={page} onClick={() => goToPage(page as number)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === page ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30" : "border border-orange-500/20 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"}`}>{page}</button>)}
                    </div>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-orange-500/30 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-orange-500/10 enabled:hover:border-orange-500/60 enabled:hover:text-orange-400">Next <ChevronRight className="w-4 h-4" /></button>
                </div>
                )}
                </>
            )}
          </div>
        </section>
      </AuthGate>
    </div>
  );
}