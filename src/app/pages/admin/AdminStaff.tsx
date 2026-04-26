import { useEffect, useState } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight, UserPlus, Shield, Check, X, AlertTriangle, Briefcase, Edit, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../../config/api";
import { useAuth } from "../../context/AuthContext";

interface StaffMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
  to: number;
  from: number;
}

// 🔥 HELPER: Auto-Capitalization for names
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function AdminStaff() {
  const { user } = useAuth();

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: "", last_name: "", role: "staff", email: "", phone: "+63", password: "", password_confirmation: "" }); // 🔥 Default to +63
  const [formErrors, setFormErrors] = useState<any>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", role: "", email: "", phone: "+63" });

  const fetchStaff = async (page: number, search: string, role: string) => {
    setLoading(true);
    try {
    const res = await api.post('https://embergym.onrender.com/api/admin/staff', addForm);      
    setStaffList(res.data.staff?.data || []);
      setPagination({
        current_page: res.data.staff?.current_page || 1,
        last_page: res.data.staff?.last_page || 1,
        total: res.data.staff?.total || 0,
        from: res.data.staff?.from || 0,
        to: res.data.staff?.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = searchTerm ? 500 : 0; 
    const delayDebounceFn = setTimeout(() => {
      fetchStaff(currentPage, searchTerm, roleFilter);
    }, delay);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, roleFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setFormErrors({});

    // 🔥 Phone validation rule before submitting
    const phoneRegex = /^\+63\d{9,10}$/;
    if (!phoneRegex.test(addForm.phone)) {
        setFormErrors({phone: ["Phone number must be +63 followed by 9 or 10 digits."]});
        setIsAdding(false);
        return;
    }

    try {
// 🔥 Add the /api prefix so Laravel accepts the data!
      await api.post('/api/admin/staff', addForm);      
      setShowAddModal(false);
      setAddForm({ first_name: "", last_name: "", role: "staff", email: "", phone: "+63", password: "", password_confirmation: "" });
      fetchStaff(currentPage, searchTerm, roleFilter);
      showToast(`${addForm.first_name} was successfully added.`);
    } catch (error: any) {
      if (error.response?.status === 422) setFormErrors(error.response.data.errors);
      else alert(error.response?.data?.message || "Failed to add staff.");
    } finally {
      setIsAdding(false);
    }
  };

  const openEditModal = (staff: StaffMember) => {
    setStaffToEdit(staff);
    // Ensure phone starts with +63 if it doesn't already
    let safePhone = staff.phone;
    if (!safePhone.startsWith("+63")) {
      safePhone = "+63" + safePhone.replace(/\D/g, "");
    }

    setEditForm({
      first_name: staff.first_name,
      last_name: staff.last_name,
      role: staff.role,
      email: staff.email,
      phone: safePhone
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffToEdit) return;
    setIsEditing(true);
    setFormErrors({});

    // 🔥 Phone validation rule before submitting
    const phoneRegex = /^\+63\d{9,10}$/;
    if (!phoneRegex.test(editForm.phone)) {
        setFormErrors({phone: ["Phone number must be +63 followed by 9 or 10 digits."]});
        setIsEditing(false);
        return;
    }

    try {
      await api.put(`/api/admin/staff/${staffToEdit.id}`, editForm);
      setShowEditModal(false);
      fetchStaff(currentPage, searchTerm, roleFilter);
      showToast(`${editForm.first_name}'s profile was updated.`);
    } catch (error: any) {
      if (error.response?.status === 422) setFormErrors(error.response.data.errors);
      else alert(error.response?.data?.message || "Failed to update staff.");
    } finally {
      setIsEditing(false);
    }
  };

  const executeDelete = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/staff/${staffToDelete.id}`);
      const deletedName = `${staffToDelete.first_name} ${staffToDelete.last_name}`;
      fetchStaff(currentPage, searchTerm, roleFilter);
      setStaffToDelete(null); 
      showToast(`${deletedName} was successfully removed.`);
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Failed to remove member."}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const getRoleBadge = (role: string) => {
    const safeRole = role || 'staff';
    const styles: Record<string, string> = {
      super_admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      admin: "bg-red-500/10 text-red-400 border-red-500/20",
      trainer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      receptionist: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      staff: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[safeRole] || styles.staff} uppercase tracking-wider`}>
        {safeRole.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-gray-950 border border-green-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-white px-5 py-4 rounded-xl">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0"><Check className="w-5 h-5 text-green-500" /></div>
            <p className="text-sm font-medium pr-4">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="text-gray-500 hover:text-white transition-colors ml-auto"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD STAFF MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => !isAdding && setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-orange-500" /> Secure Staff Enrollment</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form id="addStaffForm" onSubmit={handleAddStaff} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
                        <input 
                            type="text" 
                            required 
                            value={addForm.first_name} 
                            onChange={e => {
                                // 🔥 Clean and Capitalize
                                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                                setAddForm({...addForm, first_name: toTitleCase(cleanValue)})
                            }} 
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" 
                        />
                        {formErrors.first_name && <p className="text-red-400 text-xs mt-1">{formErrors.first_name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            required 
                            value={addForm.last_name} 
                            onChange={e => {
                                // 🔥 Clean and Capitalize
                                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                                setAddForm({...addForm, last_name: toTitleCase(cleanValue)})
                            }} 
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Role Assignment</label>
                      <select value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none appearance-none">
                        {/* 🔥 REMOVED Super Admin Option */}
                        <option value="admin">Admin</option>
                        <option value="trainer">Trainer</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="staff">Standard Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Official Email (@embergym.com)</label>
                      <input type="email" required placeholder="name@embergym.com" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className={`w-full bg-black/50 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none`} />
                      {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email[0]}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+63 9XX XXX XXXX" 
                        value={addForm.phone} 
                        onChange={e => {
                            // 🔥 Lock to +63 and restrict to numbers
                            let val = e.target.value;
                            if (!val.startsWith("+63")) val = "+63"; 
                            const digits = val.slice(3).replace(/\D/g, ""); 
                            const limitedDigits = digits.slice(0, 10); 
                            setAddForm({...addForm, phone: "+63" + limitedDigits});
                        }} 
                        className={`w-full bg-black/50 border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none`} 
                      />
                      {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Initial Password</label>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} required minLength={8} value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-white focus:border-orange-500 outline-none" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password[0]}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input type={showConfirmPassword ? "text" : "password"} required minLength={8} value={addForm.password_confirmation} onChange={e => setAddForm({...addForm, password_confirmation: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-white focus:border-orange-500 outline-none" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-5 border-t border-gray-800 bg-gray-950 flex justify-end gap-3 shrink-0">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" form="addStaffForm" disabled={isAdding} className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isAdding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Enroll Staff"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- EDIT STAFF MODAL --- */}
      <AnimatePresence>
        {showEditModal && staffToEdit && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => !isEditing && setShowEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Edit className="w-5 h-5 text-orange-500" /> Edit Profile</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form id="editStaffForm" onSubmit={handleEditStaff} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
                        <input 
                            type="text" 
                            required 
                            value={editForm.first_name} 
                            onChange={e => {
                                // 🔥 Clean and Capitalize
                                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                                setEditForm({...editForm, first_name: toTitleCase(cleanValue)})
                            }} 
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" 
                        />
                        {formErrors.first_name && <p className="text-red-400 text-xs mt-1">{formErrors.first_name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            required 
                            value={editForm.last_name} 
                            onChange={e => {
                                // 🔥 Clean and Capitalize
                                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                                setEditForm({...editForm, last_name: toTitleCase(cleanValue)})
                            }} 
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Role Assignment</label>
                      <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none appearance-none">
                        {/* 🔥 Keep Super Admin ONLY if editing an existing Super Admin, otherwise hide it */}
                        {staffToEdit.role === 'super_admin' ? (
                          <option value="super_admin">Super Admin</option>
                        ) : (
                          <>
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="staff">Standard Staff</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Official Email (@embergym.com)</label>
                      <input type="email" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className={`w-full bg-black/50 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none`} />
                      {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email[0]}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={editForm.phone} 
                        onChange={e => {
                             // 🔥 Lock to +63 and restrict to numbers
                             let val = e.target.value;
                             if (!val.startsWith("+63")) val = "+63"; 
                             const digits = val.slice(3).replace(/\D/g, ""); 
                             const limitedDigits = digits.slice(0, 10); 
                             setEditForm({...editForm, phone: "+63" + limitedDigits});
                        }} 
                        className={`w-full bg-black/50 border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none`} 
                       />
                      {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone[0]}</p>}
                    </div>
                  </form>
                </div>

                <div className="p-5 border-t border-gray-800 bg-gray-950 flex justify-end gap-3 shrink-0">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" form="editStaffForm" disabled={isEditing} className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isEditing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DELETE MODAL --- */}
      <AnimatePresence>
        {staffToDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm" onClick={() => !isDeleting && setStaffToDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-gray-950 border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden pointer-events-auto">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Terminate Access?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to remove <strong className="text-white">{staffToDelete.first_name} {staffToDelete.last_name}</strong>?
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setStaffToDelete(null)} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition-colors">Cancel</button>
                    <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors flex items-center justify-center">
                      {isDeleting ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-orange-500" /> Team Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {loading && !pagination ? "..." : pagination?.total || 0} total personnel
          </p>
        </div>
        {['super_admin', 'admin'].includes(user?.role || '') && (
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-orange-600/20">
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        )}
      </div>

      {/* --- FILTER TABS --- */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {['all', 'admin', 'trainer', 'receptionist', 'staff'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setRoleFilter(tab); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              roleFilter === tab ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Personnel' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search staff directory..." value={searchTerm} onChange={handleSearch} className="w-full bg-gray-950 border border-gray-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[300px]">
          <table className="w-full text-sm">
            <thead className="bg-black/40 border-b border-gray-800">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4 font-semibold">Name</th>
                <th className="text-left px-5 py-4 font-semibold">Role</th>
                <th className="text-left px-5 py-4 font-semibold">Contact</th>
                <th className="text-left px-5 py-4 font-semibold">Joined</th>
                <th className="text-right px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tbody key="skeleton-tbody" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[...Array(5)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-gray-800/50">
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-32 animate-pulse"></div></td>
                      <td className="px-5 py-4"><div className="h-6 bg-gray-800 rounded-md w-24 animate-pulse"></div></td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="h-4 bg-gray-800 rounded-md w-48 animate-pulse"></div>
                          <div className="h-3 bg-gray-800 rounded-md w-24 animate-pulse"></div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-800 rounded-md w-20 animate-pulse"></div></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-gray-800 rounded-lg animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-800 rounded-lg animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </motion.tbody>
              ) : (
                <motion.tbody key="data-tbody" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {(staffList || []).map((staff) => {
                    const canEditOrDelete = !(user?.role === 'admin' && staff.role === 'super_admin');

                    return (
                      <tr key={staff.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors group">
                        <td className="px-5 py-4 text-white font-medium">{staff.first_name} {staff.last_name}</td>
                        <td className="px-5 py-4">{getRoleBadge(staff.role)}</td>
                        <td className="px-5 py-4 text-gray-400">
                          <div className="flex flex-col gap-0.5">
                            <span>{staff.email}</span>
                            <span className="text-xs text-gray-500">{staff.phone}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-400">{new Date(staff.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-right">
                          {canEditOrDelete ? (
                            <div className="flex justify-end gap-1">
                              <button onClick={() => openEditModal(staff)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Staff">
                                <Edit className="w-4 h-4" />
                              </button>
                              {user?.id !== staff.id && (
                                <button onClick={() => setStaffToDelete(staff)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove Staff">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600 italic px-2">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </motion.tbody>
              )}
            </AnimatePresence>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-5 py-4 border-t border-gray-800 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="text-white">{pagination.from || 0}</span> to <span className="text-white">{pagination.to || 0}</span> of <span className="text-white">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || loading} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-semibold text-white">Page {currentPage} of {pagination.last_page}</div>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.last_page))} disabled={currentPage === pagination.last_page || loading} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}