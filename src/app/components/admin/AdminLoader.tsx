import { motion } from "motion/react";

export function AdminLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center w-full">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            EMBER GYM
          </h1>
          {/* Admin Indicator */}
          <span className="text-sm font-bold text-orange-500 tracking-[0.4em] uppercase mt-1 opacity-90">
            Admin Panel
          </span>
        </div>
        
        {/* Bouncing Dots */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </motion.div>
    </div>
  );
}