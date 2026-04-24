import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react"; // 🔥 ADDED

const navItems = [
  { to: "/admin",          label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/members",  label: "Members",   icon: Users },
  { to: "/admin/staff",    label: "Staff",     icon: UserCog },
  { to: "/admin/bookings", label: "Bookings",  icon: Calendar },
  { to: "/admin/concerns", label: "Concerns",  icon: Settings },
];

export function AdminLayout() {
  const { user, logout, isLoggingOut } = useAuth(); // 🔥 ADDED isLoggingOut
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setSidebarOpen(false); // Instantly close the mobile sidebar
    logout();
    navigate("/login");
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "AD";

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-orange-500/20 flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-orange-500/20">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">EMBER GYM</p>
            <p className="text-xs text-orange-400 capitalize">{user?.role ?? "Admin"} Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-orange-500/20">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut} // 🔥 Prevents double-clicks
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-black border-b border-orange-500/20 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm">Admin Panel</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}