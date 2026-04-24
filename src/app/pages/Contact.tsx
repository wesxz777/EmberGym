import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Please enter your message or concern";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. The Handshake (wakes up the security token)
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");

      // 2. The Payload matching our new ContactMessage model
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      // 3. The Request to our brand new endpoint
      const response = await axios.post("http://localhost:8000/api/contact", payload);

      if (response.status === 200 || response.status === 201) {
        setIsSubmitted(true);

        // Fire a signal so the Admin dashboard can pick it up in real-time later!
        window.dispatchEvent(new Event("new-concern"));

        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
        }, 8000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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
              Have a question, concern, or just want to say hi? Send us a message and our team will get back to you shortly!
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
                        JP Rizal Extension
                        <br />
                        West Rembo, Taguig City
                        <br />
                        Metro Manila, 1215, Philippines
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-400">
                        +63 917 123 4567
                        <br />
                        (555) 123-4567
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-400">info@embergym.ph</p>
                    </div>
                  </div>

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
                        <p className="text-orange-500 text-sm mt-2">Philippine Time (PHT, UTC+8)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6">
                Send a <span className="text-orange-500">Message</span>
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
                    Message Sent!
                  </h3>
                  <p className="text-gray-400">
                    Thank you for reaching out. Our team will review your message and get back to you soon.
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
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/[^a-zA-Z\s.]/g, "").trimStart();
                        e.target.value = cleanValue;
                        handleChange(e);
                      }}
                      className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                        formErrors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-orange-500/30 focus:border-orange-500"
                      }`}
                      placeholder="Wesley Xyron C. Caya"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
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
                        placeholder="your@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
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
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                          if (onlyNums.length <= 11) {
                            e.target.value = onlyNums;
                            handleChange(e);
                          }
                        }}
                        inputMode="numeric"
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.phone
                            ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="(09+) XX-XXX-XXXX"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Message / Concern *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors resize-none ${
                        formErrors.message
                          ? "border-red-500 focus:border-red-500"
                          : "border-orange-500/30 focus:border-orange-500"
                      }`}
                      placeholder="How can we help you today?"
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <p className="text-red-500 text-sm text-center">{submitError}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}