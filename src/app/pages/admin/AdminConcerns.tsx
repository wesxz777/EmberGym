import { useState, useEffect } from "react";
import { Mail, CheckCircle, Clock, Phone, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../utils/api";

interface Concern {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "unread" | "read" | "resolved";
  created_at: string;
}

export function AdminConcerns() {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConcerns = async () => {
    try {
      const res = await api.get('/admin/concerns');
      setConcerns(res.data);
    } catch (error) {
      console.error("Failed to fetch concerns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerns();

    // 🔥 Real-time listener! Updates the inbox if a user submits a form right now!
    window.addEventListener("new-concern", fetchConcerns);
    return () => window.removeEventListener("new-concern", fetchConcerns);
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await api.patch(`/admin/concerns/${id}/resolve`);
      // Update UI optimistically
      setConcerns(concerns.map(c => c.id === id ? { ...c, status: "resolved" } : c));
    } catch (error) {
      alert("Failed to mark as resolved.");
    }
  };

  const filteredConcerns = concerns.filter(c => {
    const matchesFilter = filter === "all" ? true : c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = concerns.filter(c => c.status === "unread").length;


  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Contact & Concerns
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage inquiries and user support messages.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search names or emails..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-orange-500 outline-none transition-colors"
            />
          </div>
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 w-full sm:w-auto">
            {(["all", "unread", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === f ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // 🔥 THE NEW SKELETON LOADER CARDS 🔥
            [...Array(4)].map((_, index) => (
              <motion.div key={`skeleton-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-5 bg-gray-800 rounded-md w-40 animate-pulse mb-3"></div>
                    <div className="flex gap-4">
                      <div className="h-3 bg-gray-800 rounded-md w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-800 rounded-md w-24 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-md w-16 animate-pulse"></div>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-gray-800 mb-4 h-20 animate-pulse"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 bg-gray-800 rounded-full w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-800 rounded-lg w-32 animate-pulse"></div>
                </div>
              </motion.div>
            ))
          ) : filteredConcerns.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-12 text-center bg-gray-900 border border-gray-800 rounded-2xl flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-white font-medium">Inbox Zero</h3>
              <p className="text-gray-500 text-sm">No messages found for this filter.</p>
            </motion.div>
          ) : (
            filteredConcerns.map((concern) => (
              // ... Your existing motion.div for the concern cards stays exactly the same here ...
              <motion.div key={concern.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-gray-900 border rounded-2xl p-6 transition-all ${concern.status === 'unread' ? 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-gray-800'}`}>
                {/* Your card content */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {concern.name}
                      {concern.status === 'unread' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <a href={`mailto:${concern.email}`} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                        <Mail className="w-3 h-3" /> {concern.email}
                      </a>
                      {concern.phone && (
                        <a href={`tel:${concern.phone}`} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                          <Phone className="w-3 h-3" /> {concern.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {new Date(concern.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-gray-800 mb-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{concern.message}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    {concern.status === 'resolved' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-500 uppercase bg-green-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-500 uppercase bg-orange-500/10 px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" /> Needs Action
                      </span>
                    )}
                  </div>
                  
                  {concern.status !== 'resolved' && (
                    <button 
                      onClick={() => handleResolve(concern.id)}
                      className="text-xs font-bold text-white bg-gray-800 hover:bg-green-600 border border-gray-700 hover:border-green-500 px-4 py-2 rounded-lg transition-all"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}