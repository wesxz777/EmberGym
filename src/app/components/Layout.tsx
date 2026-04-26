import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogIn, LogOut, User, Lock, CreditCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ProfileModal, ProfileTab } from "./ProfileModal";
import { ChatBot } from "./ChatBot";
import { NotificationBell } from "./NotificationBell";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<ProfileTab>("profile");
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isLoggedIn, user, logout, isAuthLoading, isLoggingOut } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/classes", label: "Classes" },
    { path: "/trainers", label: "Trainers" },
    { path: "/membership", label: "Membership" },
    { path: "/schedule", label: "Schedule" },
    { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Instantly close menus so the loading screen looks clean
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    
    // Trigger the actual logout process (which sets isLoggingOut to true)
    logout();
    
    // Redirect to home
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "EG";

  const openProfileModal = (tab: ProfileTab) => {
    setProfileModalTab(tab);
    setProfileModalOpen(true);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Initial App Load Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase">
            EMBER GYM
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* 🔥 SLEEK LOGOUT OVERLAY 🔥 */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1, 0.95] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-5"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase tracking-widest">
                Logging Out
              </h1>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-orange-500/20">
        <div className="w-full px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-20 relative">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-0 group flex-shrink-0 z-10">
              <div className="group-hover:scale-110 transition-transform">
                <img src="public\images\LogoImg\emberGymLogo.png" alt="Ember Gym" className="h-14 w-auto" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent ml-2 hidden sm:block uppercase">
                EMBER GYM
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 w-max">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-bold transition-colors hover:text-orange-500 ${
                    isActive(link.path) ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Actions */}
            <div className="hidden lg:flex items-center gap-6 flex-shrink-0 z-10">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <NotificationBell />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2.5 bg-gray-900 border border-orange-500/20 hover:border-orange-500/50 px-3 py-1.5 rounded-full transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-xs">
                        {initials}
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {user.firstName}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-gray-900 border border-orange-500/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-orange-500/10">
                          <p className="text-sm font-semibold text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          {user.membership && (
                            <span className="inline-block mt-1.5 text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                              {user.membership} Plan
                            </span>
                          )}
                        </div>

                        <div className="py-1.5">
                          <button
                            onClick={() => openProfileModal("profile")}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            Edit Profile
                          </button>
                          <button
                            onClick={() => openProfileModal("password")}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            Change Password
                          </button>
                          <button
                            onClick={() => openProfileModal("membership")}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                              <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                            </div>
                            Membership
                          </button>
                        </div>
                        
                        {/* Dropdown Logout */}
                        <div className="border-t border-orange-500/10 p-1.5">
                           <button 
                             onClick={handleLogout} 
                             disabled={isLoggingOut}
                             className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <LogOut className="w-4 h-4" /> 
                             {isLoggingOut ? "Logging out..." : "Log Out"}
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="border border-gray-500 hover:border-gray-300 text-gray-300 hover:text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/50 px-8 py-2.5 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 z-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/98 border-t border-orange-500/20">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-base font-medium transition-colors ${
                    isActive(link.path) ? "text-orange-500" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && user ? (
                <>
                  <div className="pt-2 border-t border-orange-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        {user.membership && (
                          <span className="inline-block mt-0.5 text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">
                            {user.membership} Plan
                          </span>
                        )}
                      </div>
                    </div>

                    <NotificationBell />

                    {/* Mobile profile actions */}
                    <div className="space-y-2 mb-3 mt-4">
                      <button
                        onClick={() => openProfileModal("profile")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-900 rounded-lg text-sm text-gray-300"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => openProfileModal("password")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-900 rounded-lg text-sm text-gray-300"
                      >
                        <Lock className="w-4 h-4 text-purple-400" />
                        Change Password
                      </button>
                      <button
                        onClick={() => openProfileModal("membership")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-900 rounded-lg text-sm text-gray-300"
                      >
                        <CreditCard className="w-4 h-4 text-orange-400" />
                        Membership
                      </button>
                    </div>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoggingOut ? "Logging out..." : "Sign Out"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-medium text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        defaultTab={profileModalTab}
      />

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Chatbot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-orange-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="public\LogoImg\emberGymLogo.png" alt="Ember Gym" className="h-20 w-auto" />
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase">
                  EMBER GYM
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Transform your body, transform your life. Join the ultimate fitness community and achieve your goals with expert trainers and state-of-the-art facilities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-orange-500">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* HARDCODED CONTACT DETAILS */}
            <div>
              <h3 className="font-semibold mb-4 text-orange-500">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="whitespace-pre-wrap">JP Rizal Extension, West Rembo{"\n"}Taguig City, Metro Manila, 1215</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: embergym@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Ember Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}