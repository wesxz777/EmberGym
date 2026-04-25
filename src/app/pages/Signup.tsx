import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

// 🔥 HELPER: Auto-Capitalization
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+63", // 🔥 Initialize with locked prefix
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<Record<string, { available: boolean | null; checking: boolean }>>({
    email: { available: null, checking: false },
    phone: { available: null, checking: false },
  });

  const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkEmailAvailability = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setAvailability((prev) => ({
      ...prev,
      email: { ...prev.email, checking: true },
    }));

    try {
      const response = await axios.get("https://embergym.onrender.com/api/check-email", {
        params: { email },
      });
      setAvailability((prev) => ({
        ...prev,
        email: { available: response.data.available, checking: false },
      }));
    } catch (error) {
      setAvailability((prev) => ({
        ...prev,
        email: { ...prev.email, checking: false },
      }));
    }
  };

  const checkPhoneAvailability = async (phone: string) => {
    if (!phone || phone.length < 12) return; // +63 + 9 digits minimum

    setAvailability((prev) => ({
      ...prev,
      phone: { ...prev.phone, checking: true },
    }));

    try {
      const response = await axios.get("https://embergym.onrender.com/api/check-phone", {
        params: { phone },
      });
      setAvailability((prev) => ({
        ...prev,
        phone: { available: response.data.available, checking: false },
      }));
    } catch (error) {
      setAvailability((prev) => ({
        ...prev,
        phone: { ...prev.phone, checking: false },
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    } else if (availability.email.available === false) {
      errors.email = "This email is already in use";
    }

    // 🔥 STRICT PHONE VALIDATION: Must be +63 followed by exactly 9 or 10 digits
    const phoneRegex = /^\+63\d{9,10}$/;
    if (formData.phone === "+63" || !formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid 9 or 10 digit number after +63";
    } else if (availability.phone.available === false) {
      errors.phone = "This phone number is already in use";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setFormErrors({}); 

      try {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        };

        const response = await axios.post("https://embergym.onrender.com/api/register", payload, {
         headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
         }
       });
       
        if (response.status === 201 || response.status === 200) {
          setIsSuccess(true);
        }
        
      } catch (error: any) {
        setFormErrors({ submit: "Registration failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "email") {
      if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);
      emailCheckTimeout.current = setTimeout(() => {
        checkEmailAvailability(value);
      }, 500);
    }

    if (name === "phone") {
      if (phoneCheckTimeout.current) clearTimeout(phoneCheckTimeout.current);
      phoneCheckTimeout.current = setTimeout(() => {
        checkPhoneAvailability(value);
      }, 500);
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[a-z]/.test(formData.password)) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/\d/.test(formData.password)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-yellow-500";
    if (strength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-20 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              EMBER GYM
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Start Your Fitness Journey Today</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of members who have transformed their lives with Ember Gym.
          </p>
          <div className="space-y-4">
            {[
              { text: "Personalized workout plans", icon: CheckCircle },
              { text: "Expert certified trainers", icon: CheckCircle },
              { text: "State-of-the-art equipment", icon: CheckCircle },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <benefit.icon className="w-6 h-6 text-orange-500" />
                <p className="text-gray-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Signup Form OR Success UI */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 md:p-12 min-h-[600px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              // --- SUCCESS UI ---
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-white">Registration Successful!</h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                  Welcome to Ember Gym, <span className="text-orange-500 font-semibold">{formData.firstName}</span>! Your account has been created successfully. You can now log in to start your fitness journey.
                </p>
                <Link to="/login" className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                  <User className="w-5 h-5" />
                  Go to Login
                </Link>
              </motion.div>
            ) : (
              // --- FORM UI ---
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-500 hover:text-orange-400 font-medium">Sign in</Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formErrors.submit && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={(e) => {
                            // 🔥 FIX: Clean and Auto-Capitalize First Name
                            const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                            e.target.value = toTitleCase(cleanValue);
                            handleChange(e);
                          }}
                          className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 focus:outline-none transition-colors ${
                            formErrors.firstName ? "border-red-500 focus:border-red-500" : "border-orange-500/30 focus:border-orange-500"
                          }`}
                          placeholder="Juan"
                        />
                      </div>
                      {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => {
                          // 🔥 FIX: Clean and Auto-Capitalize Last Name
                          const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                          e.target.value = toTitleCase(cleanValue);
                          handleChange(e);
                        }}
                        className={`w-full bg-black border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          formErrors.lastName ? "border-red-500 focus:border-red-500" : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="Dela Cruz"
                      />
                      {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 focus:outline-none transition-colors ${
                          formErrors.email ? "border-red-500 focus:border-red-500"
                            : availability.email.available === true ? "border-green-500 focus:border-green-500"
                            : availability.email.available === false ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="your@email.com"
                      />
                      {availability.email.checking && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="animate-spin">⌛</div></div>}
                      {!availability.email.checking && availability.email.available === true && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                      {!availability.email.checking && availability.email.available === false && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                    </div>
                    {availability.email.available === true && !formErrors.email && <p className="text-green-500 text-sm mt-1">Email is available</p>}
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          // 🔥 FIX: Lock +63 and restrict to numbers only, max 10 digits
                          let val = e.target.value;
                          if (!val.startsWith("+63")) val = "+63"; 
                          const digits = val.slice(3).replace(/\D/g, ""); // Extract everything after +63 and remove non-numbers
                          const limitedDigits = digits.slice(0, 10); // Limit to 10 digits max
                          e.target.value = "+63" + limitedDigits;
                          handleChange(e);
                        }}
                        inputMode="numeric"
                        className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 focus:outline-none transition-colors ${
                          formErrors.phone ? "border-red-500 focus:border-red-500"
                            : availability.phone.available === true ? "border-green-500 focus:border-green-500"
                            : availability.phone.available === false ? "border-red-500 focus:border-red-500"
                            : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="+63 9XX XXX XXXX"
                      />
                      {availability.phone.checking && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="animate-spin">⌛</div></div>}
                      {!availability.phone.checking && availability.phone.available === true && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                      {!availability.phone.checking && availability.phone.available === false && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                    </div>
                    {availability.phone.available === true && !formErrors.phone && <p className="text-green-500 text-sm mt-1">Phone number is available</p>}
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 focus:outline-none transition-colors ${
                          formErrors.password ? "border-red-500 focus:border-red-500" : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Password strength</span>
                          <span className={`${passwordStrength() === 100 ? "text-green-500" : "text-gray-400"}`}>{passwordStrength()}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength()}%` }}></div>
                        </div>
                      </div>
                    )}
                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 focus:outline-none transition-colors ${
                          formErrors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-orange-500/30 focus:border-orange-500"
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
                  </div>

                  {/* Terms and Conditions */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1 rounded border-orange-500/30 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-300">
                        I agree to the <Link to="/terms" className="text-orange-500 hover:text-orange-400">Terms and Conditions</Link> and <Link to="/privacy" className="text-orange-500 hover:text-orange-400">Privacy Policy</Link>
                      </span>
                    </label>
                    {formErrors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{formErrors.agreeToTerms}</p>}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}