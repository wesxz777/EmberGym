import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogIn, LogOut, User, Lock, CreditCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ProfileModal, ProfileTab } from "./ProfileModal";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<ProfileTab>("profile");
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
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
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";

  const openProfileModal = (tab: ProfileTab) => {
    setProfileModalTab(tab);
    setProfileModalOpen(true);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-0 group">
              <div className="group-hover:scale-110 transition-transform">
                <img src="/LogoImg/emberGymLogo.png" alt="Ember Gym" className="h-23 w-auto" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                EMBER GYM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                    isActive(link.path) ? "text-orange-500" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && user ? (
                /* Logged-in: avatar pill + standalone logout button */
                <div className="flex items-center gap-3">
                  {/* Avatar + name pill (opens dropdown) */}
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

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-gray-900 border border-orange-500/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
                        {/* User info header */}
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

                        {/* Menu items */}
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
                      </div>
                    )}
                  </div>

                  {/* Prominent Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-red-600/15 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                /* Guest auth buttons */
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
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
          <div className="md:hidden bg-black/98 border-t border-orange-500/20">
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

                    {/* Mobile profile actions */}
                    <div className="space-y-2 mb-3">
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
                      className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
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

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-orange-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/LogoImg/emberGymLogo.png" alt="Ember Gym" className="h-8 w-auto" />
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
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
            <div>
              <h3 className="font-semibold mb-4 text-orange-500">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>JP Rizal Extension, West Rembo</li>
                <li>Taguig City, Metro Manila, 1215</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: emgergym@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Ember Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}