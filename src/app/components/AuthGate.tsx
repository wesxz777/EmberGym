import { ReactNode } from "react";
import { Link } from "react-router";
import { Lock, LogIn, UserPlus, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

interface AuthGateProps {
  children: ReactNode;
  /** Title shown on the lock screen */
  title?: string;
  /** Description shown below the title */
  description?: string;
  /** Preview: blurred glimpse of content behind the gate */
  preview?: ReactNode;
}

export function AuthGate({
  children,
  title = "Members Only",
  description = "Please log in or create a free account to access this content.",
  preview,
}: AuthGateProps) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <>{children}</>;

  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred background preview */}
      {preview && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="blur-sm opacity-30 scale-105 origin-top">{preview}</div>
          {/* gradient fade at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black" />
        </div>
      )}

      {/* Gate overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-[60vh] py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-orange-500/30 rounded-3xl p-10 md:p-14 max-w-lg w-full text-center shadow-2xl shadow-black/60 backdrop-blur-md"
        >
          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Lock className="w-10 h-10 text-white" />
              </div>
              {/* small dumbbell badge */}
              <div className="absolute -bottom-2 -right-2 bg-gray-900 border border-orange-500/30 rounded-full p-1.5">
                <Dumbbell className="w-4 h-4 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-3xl font-bold mb-3 text-white">{title}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{description}</p>

          {/* Perks */}
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl p-5 mb-8 text-left space-y-3">
            {[
              "View all trainer profiles & specialties",
              "Browse the full weekly schedule",
              "Book classes & personal sessions",
              "Track your fitness progress",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-sm text-gray-300">{perk}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/40 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
            <Link
              to="/signup"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-orange-500/20 py-3.5 rounded-xl font-semibold transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up Free
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-5">
            Free 7-day trial · No credit card required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
