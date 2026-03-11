import { useState } from "react";
import { Link } from "react-router";
import {
  Dumbbell,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Target,
  Zap,
  X,
  Flame,
  ChevronRight,
  MapPin,
  Check,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";

export function Home() {
  const { isLoggedIn, user } = useAuth();
  const { bookings, removeBooking } = useBookings();
  const [bmiData, setBmiData] = useState({ weight: "", height: "", unit: "metric" });
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  } | null>(null);
  const [showWorkoutTip, setShowWorkoutTip] = useState(false);

  const calculateBMI = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height);

    if (!weight || !height || weight <= 0 || height <= 0) {
      alert("Please enter valid weight and height values");
      return;
    }

    let bmi: number;
    if (bmiData.unit === "metric") {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      // BMI = (weight (lbs) / (height (inches))^2) * 703
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

  const workoutTips = [
    "Start with a 5-10 minute warm-up to prepare your muscles",
    "Stay hydrated - drink water before, during, and after your workout",
    "Focus on form over weight to prevent injuries",
    "Rest for 48 hours between strength training the same muscle groups",
    "Combine cardio and strength training for best results",
  ];

  const currentTip = workoutTips[Math.floor(Math.random() * workoutTips.length)];

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
          {/* Decorative flame blobs */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Greeting */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {user.firstName[0]}{user.lastName ? user.lastName[0] : ""}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Welcome Back</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {user.firstName} {user.lastName}! 💪
                  </h2>
                  <p className="text-white/80 mt-1">Ready to crush your goals today? Let's get moving!</p>
                </div>
              </div>

              {/* Quick-action cards */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {[
                  { icon: Calendar, label: "My Schedule", to: "/schedule" },
                  { icon: Dumbbell, label: "Classes", to: "/classes" },
                  { icon: Target, label: "Membership", to: "/membership" },
                ].map(({ icon: Icon, label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:shadow-lg group"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress row */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {[
                { icon: Clock, label: "Booked This Week", value: String(bookings.length) },
                { icon: Award, label: "Member Since", value: "2026" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{value}</p>
                    <p className="text-white/70 text-xs">{label}</p>
                  </div>
                </div>
              ))}
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
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
              >
                View Full Schedule <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <AnimatePresence mode="popLayout">
              {bookings.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                      {/* Check icon */}
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
                          <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">
                            {booking.type}
                          </span>
                          <button
                            onClick={() => removeBooking(booking.bookingId)}
                            className="text-xs text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="public/TrainingImg/CardioTraining.jpg"
            alt="Fitness gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all inline-block"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => setShowWorkoutTip(true)}
                className="border-2 border-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500/10 transition-all"
              >
                View Classes
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
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
                  onChange={(e) =>
                    setBmiData({ ...bmiData, weight: e.target.value })
                  }
                  className="w-full bg-black border border-orange-500/30 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
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
                  onChange={(e) =>
                    setBmiData({ ...bmiData, height: e.target.value })
                  }
                  className="w-full bg-black border border-orange-500/30 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
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
                      ? "bg-gradient-to-r from-orange-500 to-red-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  onClick={() => setBmiData({ ...bmiData, unit: "imperial" })}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    bmiData.unit === "imperial"
                      ? "bg-gradient-to-r from-orange-500 to-red-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  Imperial (lbs, inches)
                </button>
              </div>
            </div>

            <button
              onClick={calculateBMI}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Calculate BMI
            </button>

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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "5000+", label: "Active Members" },
              { icon: Dumbbell, number: "50+", label: "Classes per Week" },
              { icon: Award, number: "15+", label: "Expert Trainers" },
              { icon: TrendingUp, number: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join today and get your first month at 50% off!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="bg-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition-all inline-block"
              >
                View Membership Plans
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all inline-block"
              >
                Schedule a Tour
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workout Tip Modal */}
      {showWorkoutTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-lg w-full relative"
          >
            <button
              onClick={() => setShowWorkoutTip(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Pro Tip</h3>
            </div>
            <p className="text-lg text-gray-300 mb-6">{currentTip}</p>
            <button
              onClick={() => setShowWorkoutTip(false)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Got It!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}