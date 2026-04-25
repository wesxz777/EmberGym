import { useState } from "react";
import { Link } from "react-router";
import {
  Dumbbell,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Check,
  BookOpen,
  AlertTriangle,
  Crown,
  Flame,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import api from "../../config/api";

export function Home() {
  const { isLoggedIn, user } = useAuth();
  const { bookings, isLoadingBookings, removeBooking } = useBookings();
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const [bmiData, setBmiData] = useState({ weight: "", height: "", unit: "metric" });
  const [bmiError, setBmiError] = useState("");
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  } | null>(null);

  const calculateBMI = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height);

    if (!weight || !height || weight <= 0 || height <= 0) {
      setBmiError("Please enter valid weight and height values.");
      setBmiResult(null);
      return;
    }

    setBmiError("");

    let bmi: number;
    if (bmiData.unit === "metric") {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      bmi = (weight / (height * height)) * 703;
    }

    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-400";
    } else if (bmi < 25) {
      category = "Normal weight";
      color = "text-green-400";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-400";
    } else {
      category = "Obese";
      color = "text-red-400";
    }

    setBmiResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
  };

  const executeCancellation = async () => {
    if (!bookingToCancel) return;
    
    setIsCancelling(true);

    try {
      await api.delete(`/api/contact-bookings/${bookingToCancel.bookingId}`);
      removeBooking(bookingToCancel.bookingId);
      window.dispatchEvent(new Event("refresh-notifications"));
      setBookingToCancel(null);
    } catch (error) {
      console.error("Failed to cancel booking in database:", error);
      alert("Could not cancel the booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // --- Dynamic Dashboard Helpers ---
  const getMembershipDisplay = (plan: string | undefined | null) => {
    // If plan is null or undefined, default to Basic
    if (!plan) return { icon: Dumbbell, text: "Basic Member", color: "text-gray-200", bg: "bg-white/10" };
    
    const planLower = plan.toLowerCase();
    if (planLower === "elite") return { icon: Crown, text: "Elite Member", color: "text-yellow-300", bg: "bg-yellow-400/20" };
    if (planLower === "pro") return { icon: TrendingUp, text: "Pro Member", color: "text-orange-300", bg: "bg-white/20" };
    
    return { icon: Dumbbell, text: "Basic Member", color: "text-gray-200", bg: "bg-white/10" };
  };

  const memDetails = getMembershipDisplay(user?.membership);
  const nextClass = bookings && bookings.length > 0 ? bookings[0] : null;

  return (
    <div>
      {/* Welcome Back Banner — shown only when logged in */}
      {isLoggedIn && user && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 py-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Side: Greeting */}
              <div className="flex items-center gap-5 w-full lg:w-auto">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.[0] || ""}{user?.lastName?.[0] || ""}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
                    {user?.firstName} {user?.lastName}!
                  </h2>
                  <p className="text-white/90 font-medium">Ready to crush your goals today?</p>
                </div>
              </div>

              {/* Right Side: Horizontal Dashboard Bar */}
              <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
                
                {/* Membership Status */}
                <div className="flex-1 sm:flex-none flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 min-w-[180px]">
                  <div className={`p-2 rounded-lg ${memDetails.bg}`}>
                    <memDetails.icon className={`w-4 h-4 ${memDetails.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Plan</p>
                    <p className="text-sm font-bold text-white">{memDetails.text}</p>
                  </div>
                </div>

                {/* Up Next */}
                <div className="flex-1 sm:flex-none flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 min-w-[180px]">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Up Next</p>
                    <p className="text-sm font-bold text-white truncate">
                        {nextClass ? nextClass.className : "No classes"}
                    </p>
                  </div>
                </div>

                {/* Momentum */}
                <div className="flex-1 sm:flex-none flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 min-w-[180px]">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Flame className="w-4 h-4 text-orange-200" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Momentum</p>
                    <p className="text-sm font-bold text-white">
                        {bookings.length} {bookings.length === 1 ? 'Class' : 'Classes'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── MY SCHEDULE (logged-in only) ─────────────────────────────── */}
      {isLoggedIn && (
        <section className="bg-gray-950 border-b border-orange-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">My Schedule</h2>
                  <p className="text-gray-500 text-xs">
                    {bookings.length === 0
                      ? "No classes booked yet this week"
                      : `${bookings.length} class${bookings.length > 1 ? "es" : ""} booked this week`}
                  </p>
                </div>
              </div>
              <Link
                to="/schedule"
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 font-medium"
              >
                View Full Schedule <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── CUSTOM CANCELLATION MODAL ── */}
            <AnimatePresence>
              {bookingToCancel && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
                    onClick={() => !isCancelling && setBookingToCancel(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                  >
                    <div className="bg-gray-950 border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden pointer-events-auto">
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Cancel Booking?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                          Are you sure you want to cancel your spot in <strong className="text-white">{bookingToCancel.className}</strong> on {bookingToCancel.day}? This action cannot be undone.
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setBookingToCancel(null)}
                            disabled={isCancelling}
                            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            No
                          </button>
                          <button
                            onClick={executeCancellation}
                            disabled={isCancelling}
                            className="flex-1 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCancelling ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              "Yes"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {isLoadingBookings ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {[1, 2, 3].map((skeleton) => (
                    <div key={skeleton} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3 animate-pulse">
                      <div className="bg-gray-800 w-9 h-9 rounded-lg shrink-0 mt-0.5"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-800 rounded w-full"></div>
                        <div className="h-3 bg-gray-800 rounded w-1/4 mt-3"></div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : bookings.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-800 rounded-2xl"
                >
                  <Calendar className="w-10 h-10 text-gray-700 mb-3" />
                  <p className="text-gray-500 text-sm mb-3">You haven't booked any classes yet.</p>
                  <Link
                    to="/classes"
                    className="bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                  >
                    Browse Classes
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.bookingId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-900 border border-green-500/20 rounded-xl p-4 flex gap-3 group"
                    >
                      <div className="bg-green-500/15 border border-green-500/25 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{booking.className}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-orange-500" />{booking.day}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-500" />{booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-500" />{booking.room}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                            {booking.type}
                          </span>
                          <button
                            onClick={() => setBookingToCancel(booking)}
                            className="text-xs font-semibold text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="public/TrainingImg/CardioTraining.jpg"
            alt="Fitness gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Transform Your Body
              </span>
              <br />
              <span className="text-white">Transform Your Life</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate fitness community with expert trainers, cutting-edge equipment, and personalized programs designed for your success.
            </p>
            
            {/* 🔥 UPDATED HERO BUTTONS 🔥 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all inline-block"
              >
                Avail Memberships
              </Link>
              <Link
                to="/classes"
                className="border-2 border-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500/10 transition-all inline-block"
              >
                View Classes
              </Link>
            </div>
            
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-orange-500">Ember Gym</span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to achieve your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Trainers",
                description: "Certified professionals dedicated to your success",
              },
              {
                icon: Dumbbell,
                title: "Premium Equipment",
                description: "State-of-the-art machines and free weights",
              },
              {
                icon: Calendar,
                title: "Flexible Schedule",
                description: "Classes available 24/7 to fit your lifestyle",
              },
              {
                icon: Award,
                title: "Proven Results",
                description: "Join thousands who've transformed their lives",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/50 transition-all group"
              >
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BMI Calculator Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-orange-500">BMI</span> Calculator
            </h2>
            <p className="text-xl text-gray-400">
              Calculate your Body Mass Index and get started on your fitness journey
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Weight {bmiData.unit === "metric" ? "(kg)" : "(lbs)"}
                </label>
                <input
                  type="number"
                  value={bmiData.weight}
                  onChange={(e) => {
                    setBmiData({ ...bmiData, weight: e.target.value });
                    if (bmiError) {
                      setBmiError("");
                    }
                  }}
                  className="w-full bg-black border border-orange-500/30 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors text-white"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Height {bmiData.unit === "metric" ? "(cm)" : "(inches)"}
                </label>
                <input
                  type="number"
                  value={bmiData.height}
                  onChange={(e) => {
                    setBmiData({ ...bmiData, height: e.target.value });
                    if (bmiError) {
                      setBmiError("");
                    }
                  }}
                  className="w-full bg-black border border-orange-500/30 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors text-white"
                  placeholder="Enter height"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Unit System
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setBmiData({ ...bmiData, unit: "metric" })}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    bmiData.unit === "metric"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  onClick={() => setBmiData({ ...bmiData, unit: "imperial" })}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    bmiData.unit === "imperial"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Imperial (lbs, inches)
                </button>
              </div>
            </div>

            <button
              onClick={calculateBMI}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-4 rounded-lg font-semibold text-lg text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Calculate BMI
            </button>

            {bmiError && (
              <p className="mt-4 text-center text-sm font-medium text-red-400" role="alert" aria-live="polite">
                {bmiError}
              </p>
            )}

            {bmiResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-gradient-to-br from-gray-800 to-black border border-orange-500/30 rounded-xl p-6 text-center"
              >
                <p className="text-gray-400 mb-2">Your BMI is</p>
                <p className={`text-5xl font-bold mb-2 ${bmiResult.color}`}>
                  {bmiResult.bmi}
                </p>
                <p className={`text-xl font-semibold ${bmiResult.color}`}>
                  {bmiResult.category}
                </p>
                <p className="text-gray-400 mt-4">
                  Talk to one of our trainers to create a personalized fitness plan!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join today and get your first month at 50% off!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition-all inline-block"
              >
                View Membership Plans
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all inline-block"
              >
                Schedule a Tour
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}