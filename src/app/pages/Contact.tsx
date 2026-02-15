import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    classType: "",
    date: "",
    time: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFreeTrial, setShowFreeTrial] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Class type validation
    if (!formData.classType) {
      errors.classType = "Please select a class type";
    }

    // Date validation
    if (!formData.date) {
      errors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = "Please select a future date";
      }
    }

    // Time validation
    if (!formData.time) {
      errors.time = "Please select a time";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, you would send this to a backend
      console.log("Form submitted:", formData);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          classType: "",
          date: "",
          time: "",
          message: "",
        });
      }, 3000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const classTypes = [
    "Yoga",
    "HIIT",
    "Strength Training",
    "Cardio Cycling",
    "Pilates",
    "Boxing",
    "CrossFit",
    "Zumba",
  ];

  const timeSlots = [
    "06:00 AM",
    "08:00 AM",
    "10:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
    "08:00 PM",
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Book a class, schedule a tour, or reach out with any questions. We're here to help you start your fitness journey!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Visit Our <span className="text-orange-500">Gym</span>
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-400">
                   <p className="text-gray-400">
                                            Unit 305, Fitness Tower Building
                                      <br />
                        123 Bonifacio Global City, Taguig
                        <br />
                        Metro Manila, Philippines 1634
                      </p>

                      // Phone
                      <p className="text-gray-400">
                        +63 917 123 4567
                        <br />
                        (02) 8123-4567
                      </p>

                      // Email
                      <p className="text-gray-400">info@embergym.ph</p>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Hours</h3>
                     <div className="text-gray-400 space-y-1">
                      <p>Monday - Friday: 5:00 AM - 10:00 PM</p>
                      <p>Saturday: 6:00 AM - 9:00 PM</p>
                      <p>Sunday: 7:00 AM - 8:00 PM</p>
                      <p className="text-orange-500 text-sm">Philippine Time (PHT, UTC+8)</p>
                    </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl overflow-hidden h-80"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Interactive map would be displayed here
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Free Trial Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowFreeTrial(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                Schedule Free Trial
              </motion.button>
            </div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6">
                Book a <span className="text-orange-500">Class</span>
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="bg-green-500/20 p-6 rounded-full mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-400">
                    We'll send you a confirmation email shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                        formErrors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-orange-500/30 focus:border-orange-500"
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.phone
                            ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="0917-123-4567"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Class Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Class Type *
                    </label>
                    <select
                      name="classType"
                      value={formData.classType}
                      onChange={handleChange}
                      className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                        formErrors.classType
                          ? "border-red-500 focus:border-red-500"
                          : "border-orange-500/30 focus:border-orange-500"
                      }`}
                    >
                      <option value="">Select a class</option>
                      {classTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {formErrors.classType && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.classType}
                      </p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.date
                            ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                      />
                      {formErrors.date && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Time *
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.time
                            ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {formErrors.time && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black border border-orange-500/30 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors resize-none"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                  >
                    <Send className="w-5 h-5" />
                    Book Class
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Trial Modal */}
      {showFreeTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowFreeTrial(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">
              Start Your <span className="text-orange-500">Free Trial</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Experience Ember Gym for free! No credit card required. Your free trial includes:
            </p>
            <ul className="space-y-2 mb-6 text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Full gym access for 7 days
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                2 complimentary group classes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                1 personal training consultation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Nutrition assessment
              </li>
            </ul>
            <button
              onClick={() => setShowFreeTrial(false)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Claim Free Trial
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              No commitment. Cancel anytime.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}