import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, LogIn} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";

export function Login() {
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false); 
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const view: "login" | "forgot" =
    location.pathname.endsWith("/forgot-password") ||
    location.pathname.endsWith("forgot-password") ||
    searchParams.get("mode") === "forgot"
      ? "forgot"
      : "login";

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setFormErrors({}); // Clear old errors

      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          remember_me: formData.rememberMe, 
        };

        // 1. The Handshake
        await api.get("https://embergym.onrender.com/sanctum/csrf-cookie");

        // 2. The Login 
        const response = await api.post("/login", payload);

        if (response.status === 200 || response.status === 204) {
          
          // 3. Fetch the user profile
          const userResponse = await api.get("/user"); 
          
          // 4. Safely extract the user (sometimes Laravel wraps it in .user, sometimes it doesn't)
          const user = userResponse.data?.user || userResponse.data;

          // 5. THE AI's FIX: Use Optional Chaining (?.) to prevent crashes!
          let membership = null;
          if (user?.membership_plan && user?.membership_plan !== 'none') {
            membership = user.membership_plan.charAt(0).toUpperCase() + user.membership_plan.slice(1);
          }

          // Pass the user data to AuthContext safely with fallbacks
          login({
            id: user?.id, 
            firstName: user?.first_name || "Member",
            lastName: user?.last_name || "",
            email: user?.email || formData.email,
            phone: user?.phone || "",
            membership: membership as "Basic" | "Pro" | "Elite" | null,
            role: user?.role || "user",
          }, "sanctum-cookie-active"); 

          // Redirect based on role safely
          const adminRoles = ["admin", "manager", "super_admin"];
          if (adminRoles.includes(user?.role)) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } 
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 422) {
          setFormErrors({
            email: "Invalid email or password. Please try again.",
          });
        } else if (error.response?.status === 419) {
          alert("Session expired. Please refresh the page and try again.");
        } else {
          console.error("Login failed:", error);
          alert("Database connection failed. Is your Laravel server running?");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForgotEmail = (email: string) => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed) return "Email is required";
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
    return null;
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const validationError = validateForgotEmail(forgotEmail);
    if (validationError) {
      setForgotError(validationError);
      return;
    }

    setIsSendingReset(true);
    try {
      // Cleaned up the URL to just point to the relative route
      await api.post("/forgot-password", { email: forgotEmail.trim() });
      setForgotSuccess("If that email exists, a password reset link has been sent.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string" ? error.response.data : null) ||
        "Could not send reset email. Please try again.";
      setForgotError(message);
    } finally {
      setIsSendingReset(false);
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
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-20 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              EMBER GYM
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            Welcome Back!
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Sign in to access your workout plans, track your progress, and stay connected with your fitness community.
          </p>
          <div className="space-y-4">
            {[
              "Access personalized workout plans",
              "Track your fitness progress",
              "Book classes and sessions",
              "Connect with trainers",
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 md:p-12"
        >
          <div className="mb-8">
            {view === "login" ? (
              <>
                <h2 className="text-3xl font-bold mb-2">Sign In</h2>
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-orange-500 hover:text-orange-400 font-medium">
                    Sign up
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
                <p className="text-gray-400">
                  Enter your email and we’ll send you a reset link.
                </p>
              </>
            )}
          </div>

          {view === "login" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 focus:outline-none transition-colors ${
                    formErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-orange-500/30 focus:border-orange-500"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-black border rounded-lg pl-12 pr-12 py-3 focus:outline-none transition-colors ${
                    formErrors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-orange-500/30 focus:border-orange-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-orange-500/30 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Checking Details..." : "Sign In"}
            </button>            
            </form>
          ) : (
            <form onSubmit={handleSendReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError(null);
                      if (forgotSuccess) setForgotSuccess(null);
                    }}
                    className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 focus:outline-none transition-colors ${
                      forgotError
                        ? "border-red-500 focus:border-red-500"
                        : "border-orange-500/30 focus:border-orange-500"
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {forgotError && (
                  <p className="text-red-500 text-sm mt-1">{forgotError}</p>
                )}
                {forgotSuccess && (
                  <p className="text-green-500 text-sm mt-1">{forgotSuccess}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSendingReset ? "Sending..." : "Send reset link"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/login" className="text-orange-500 hover:text-orange-400">
                  Back to sign in
                </Link>
                <Link to="/signup" className="text-gray-300 hover:text-white">
                  Create account
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}