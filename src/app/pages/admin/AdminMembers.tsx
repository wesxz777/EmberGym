import { useEffect, useState } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight, Users, TrendingUp, AlertTriangle, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import api from "../../utils/api";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
  to: number;
  from: number;
}

interface ChartData {
  week: Array<{ name: string; joined: number }>;
  month: Array<{ name: string; joined: number }>;
  year: Array<{ name: string; joined: number }>;
}

type TimeRange = "week" | "month" | "year";

export function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  
  const [timeRange, setTimeRange] = useState<TimeRange>("week"); 
  
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMembers = async (page: number, search: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/members?page=${page}&search=${search}`);
      setMembers(res.data.members?.data || []);
      setPagination({
        current_page: res.data.members?.current_page || 1,
        last_page: res.data.members?.last_page || 1,
        total: res.data.members?.total || 0,
        from: res.data.members?.from || 0,
        to: res.data.members?.to || 0,
      });
      setChartData(res.data.chart_data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = searchTerm ? 500 : 0;
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(currentPage, searchTerm);
    }, delay);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const executeDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/admin/members/${memberToDelete.id}`);
      const deletedName = `${memberToDelete.first_name} ${memberToDelete.last_name}`;
      
      fetchMembers(currentPage, searchTerm); 
      setMemberToDelete(null); 
      setSuccessMessage(`${deletedName} was successfully removed.`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);

    } catch (error: any) {
      if (error.response?.status === 419) {
         alert("Your security token expired. The page will now refresh to renew it.");
         window.location.reload();
         return;
      }
      alert(`Error: ${error.response?.data?.message || "Failed to delete member."}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative overflow-hidden pb-12">
      
      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-gray-950 border border-green-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-white px-5 py-4 rounded-xl">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm font-medium pr-4">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="text-gray-500 hover:text-white transition-colors ml-auto shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETION MODAL ── */}
      <AnimatePresence>
        {memberToDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm" onClick={() => !isDeleting && setMemberToDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-gray-950 border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden pointer-events-auto">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Remove Member?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to delete <strong className="text-white">{memberToDelete.first_name} {memberToDelete.last_name}</strong>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setMemberToDelete(null)} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition-colors disabled:opacity-50">
                      Cancel
                    </button>
                    <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      {isDeleting ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-500" /> Premium Members Hub
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {loading && !pagination ? "..." : pagination?.total || 0} total subscriptions
        </p>
      </div>

      {/* ── GROWTH CHART ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Subscription Growth</h2>
              <p className="text-sm text-gray-400">New memberships over time</p>
            </div>
          </div>
          
          {/* Time Range Toggle */}
          <div className="flex bg-black/50 p-1 rounded-lg border border-gray-800">
            {(["week", "month", "year"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  timeRange === range 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {range === "week" ? "7 Days" : `This ${range}`}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          {loading && !chartData ? (
            <div className="w-full h-full bg-gray-800/30 rounded-xl animate-pulse"></div>
          ) : chartData && chartData[timeRange] && chartData[timeRange].length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#1F2937' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#ea580c', fontWeight: 'bold' }} />
                <Bar dataKey="joined" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No growth data available.</div>
          )}
        </div>
      </motion.div>

      {/* ── DIRECTORY TABLE ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-bold text-white">Active Subscribers Directory</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name or email..." value={searchTerm} onChange={handleSearch} className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[300px]">
          <table className="w-full text-sm">
            <thead className="bg-black/40 border-b border-gray-800">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4 font-semibold">Name</th>
                <th className="text-left px-5 py-4 font-semibold">Email</th>
                <th className="text-left px-5 py-4 font-semibold">Phone</th>
                <th className="text-left px-5 py-4 font-semibold">Joined Date</th>
                <th className="text-right px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tbody key="skeleton-tbody" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[...Array(5)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-gray-800/50">
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-32 animate-pulse"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-40 animate-pulse"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-24 animate-pulse"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-24 animate-pulse"></div></td>
                      <td className="px-5 py-4 flex justify-end"><div className="h-8 w-8 bg-gray-800 rounded-lg animate-pulse"></div></td>
                    </tr>
                  ))}
                </motion.tbody>
              ) : members.length === 0 ? (
                <motion.tbody key="empty-tbody" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                      No members found matching your search.
                    </td>
                  </tr>
                </motion.tbody>
              ) : (
                <motion.tbody key="data-tbody" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors group">
                      <td className="px-5 py-4 text-white font-medium">{member.first_name} {member.last_name}</td>
                      <td className="px-5 py-4 text-gray-400">{member.email}</td>
                      <td className="px-5 py-4 text-gray-400">{member.phone || "—"}</td>
                      <td className="px-5 py-4 text-gray-400">{new Date(member.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => setMemberToDelete(member)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove Member">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </motion.tbody>
              )}
            </AnimatePresence>
          </table>
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="px-5 py-4 border-t border-gray-800 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">Showing <span className="text-white">{pagination.from || 0}</span> to <span className="text-white">{pagination.to || 0}</span> of <span className="text-white">{pagination.total}</span> members</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || loading} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-semibold text-white">Page {currentPage} of {pagination.last_page}</div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))} disabled={currentPage === pagination.last_page || loading} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
}