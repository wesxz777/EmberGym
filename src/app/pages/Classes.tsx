import { useState } from "react";
import { Clock, Users, Heart, Zap, Flame, Lock, LogIn, Check, Crown, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { BookingModal, BookingSource } from "../components/BookingModal";
import { CLASSES, SCHEDULE } from "../data/gymDatabase";

// 🔥 NEW: The Monthly Limits Dictionary
const PLAN_MONTHLY_LIMITS: Record<string, number> = {
  Basic: 4,
  Pro: 6,
  Elite: 8
};

export function Classes() {
  const { isLoggedIn, user } = useAuth();
  const { isBooked, monthlyCount } = useBookings(); // Using the new monthly tracker

  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedIntensity, setSelectedIntensity] = useState<string>("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingSource, setBookingSource] = useState<BookingSource | null>(null);

  const classTypes = ["All", "Yoga", "HIIT", "Strength", "Cardio", "Pilates"];
  const intensityLevels = ["All", "Low", "Medium", "High"];

  const filteredClasses = CLASSES.filter((c) => {
    const typeMatch = selectedType === "All" || c.type === selectedType;
    const intensityMatch = selectedIntensity === "All" || c.intensity === selectedIntensity;
    return typeMatch && intensityMatch;
  });

  // 🔥 Establish current plan and limits
  const plan = user?.membership ?? "Basic";
  const monthlyLimit = PLAN_MONTHLY_LIMITS[plan] ?? 4;

  const getIntensityIcon = (intensity: string) => {
    if (intensity === "Low") return Heart;
    if (intensity === "Medium") return Zap;
    return Flame;
  };

  const getIntensityColor = (intensity: string) => {
    if (intensity === "Low") return "text-green-400";
    if (intensity === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  const classBookedCount = (classId: number) => {
    const cls = CLASSES.find((c) => c.id === classId);
    if (!cls) return 0;
    return SCHEDULE.filter((s) => s.className === cls.name && isBooked(s.id)).length;
  };

  const openBooking = (classId: number) => {
    setBookingSource({ kind: "class", classId });
    setModalOpen(true);
  };

  /** 🔥 CLEANED UP BUTTON STATE: Only cares about monthly quotas now */
  const getButtonState = (classId: number) => {
    const booked = classBookedCount(classId) > 0;

    if (!isLoggedIn) return { type: "login" as const };
    if (booked) return { type: "booked" as const };
    if (monthlyCount >= monthlyLimit) return { type: "limit" as const };
    return { type: "book" as const };
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-orange-500">Classes</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From high-intensity training to relaxing yoga, find the perfect class to match your fitness goals.
            </p>
            
            {/* 🔥 UPDATED: Membership usage bar now shows for ALL plans */}
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 inline-flex flex-col items-center gap-2 bg-gray-900/80 border border-orange-500/20 rounded-2xl px-6 py-3"
              >
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  {plan === "Elite" ? <Crown className="w-4 h-4 text-yellow-500" /> : <Dumbbell className="w-4 h-4 text-orange-500" />}
                  <span>{plan} Plan — </span>
                  <span className={monthlyCount >= monthlyLimit ? "text-red-400 font-semibold" : "text-orange-400 font-semibold"}>
                    {monthlyCount} / {monthlyLimit} monthly bookings used
                  </span>
                  {monthlyCount >= monthlyLimit && plan !== "Elite" && (
                    <Link to="/membership" className="text-xs text-gray-500 hover:text-orange-400 transition-colors ml-1">
                      Upgrade →
                    </Link>
                  )}
                </div>
                <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${monthlyCount >= monthlyLimit ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-red-500"}`}
                    style={{ width: `${Math.min((monthlyCount / monthlyLimit) * 100, 100)}%` }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-sm border-b border-orange-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">Class Type</label>
              <div className="flex flex-wrap gap-2">
                {classTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedType === type
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">Intensity Level</label>
              <div className="flex flex-wrap gap-2">
                {intensityLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedIntensity(level)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedIntensity === level
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"}
            </p>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Log in to book classes
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classItem, index) => {
              const IntensityIcon = getIntensityIcon(classItem.intensity);
              const btnState = getButtonState(classItem.id);
              const isClassBooked = classBookedCount(classItem.id) > 0;

              return (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={classItem.image}
                      alt={classItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium">
                      {classItem.type}
                    </div>

                    {isClassBooked && (
                      <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Booked
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2">{classItem.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{classItem.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{classItem.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Max {classItem.maxParticipants}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center gap-2 ${getIntensityColor(classItem.intensity)}`}>
                          <IntensityIcon className="w-4 h-4" />
                          <span>{classItem.intensity}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{classItem.instructor}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {classItem.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── BOOK BUTTON ── */}
                    {btnState.type === "login" && (
                      <button
                        onClick={() => openBooking(classItem.id)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-orange-500/20 py-2.5 rounded-lg font-semibold text-sm text-gray-300 transition-all"
                      >
                        <Lock className="w-4 h-4 text-orange-500" />
                        Login to Book
                      </button>
                    )}

                    {btnState.type === "booked" && (
                      <button
                        onClick={() => openBooking(classItem.id)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 py-2.5 rounded-lg font-semibold text-sm text-green-400 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Booked — Manage
                      </button>
                    )}

                    {btnState.type === "limit" && (
                      <button
                        onClick={() => openBooking(classItem.id)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 py-2.5 rounded-lg font-semibold text-sm text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        Monthly Limit Reached
                      </button>
                    )}

                    {btnState.type === "book" && (
                      <button
                        onClick={() => openBooking(classItem.id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                      >
                        Book Class
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No classes found with the selected filters.</p>
              <button
                onClick={() => { setSelectedType("All"); setSelectedIntensity("All"); }}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        source={bookingSource}
      />
    </div>
  );
}