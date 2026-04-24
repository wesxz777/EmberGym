import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  X,
  User,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  Check,
  Phone,
  Mail,
  Save,
  ShieldCheck,
  Zap,
  Crown,
  Dumbbell,
  Download,
  Loader2,
  Calendar,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export type ProfileTab = "profile" | "password" | "membership";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ProfileTab;
}

// 🔥 HELPER: Auto-Capitalization for names
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/* ─── Password strength helper ─────────────────────────────── */
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  const map = [
    { label: "", color: "bg-gray-700" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-green-500" },
    { label: "Very Strong", color: "bg-emerald-400" },
  ];
  return { score, ...map[score] };
}

/* ─── Main component ────────────────────────────────────────── */
export function ProfileModal({ isOpen, onClose, defaultTab = "profile" }: ProfileModalProps) {
  const { user, updateUser, logout } = useAuth(); // Extracted logout
  const [activeTab, setActiveTab] = useState<ProfileTab>(defaultTab);

  // Sync tab when modal opens with a different default
  useEffect(() => {
    if (isOpen) setActiveTab(defaultTab);
  }, [isOpen, defaultTab]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!user) return null;

  const tabs: { id: ProfileTab; label: string; icon: typeof User }[] = [
    { id: "profile",    label: "Edit Profile",     icon: User },
    { id: "password",   label: "Change Password",  icon: Lock },
    { id: "membership", label: "Membership",        icon: CreditCard },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-950 border border-orange-500/20 rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-orange-500/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-orange-500/10 shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                        active
                          ? "border-orange-500 text-orange-400"
                          : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab content — scrollable */}
              <div className="overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    {activeTab === "profile"    && <EditProfileTab user={user} updateUser={updateUser} />}
                    {/* Pass onClose and logout into ChangePassword so it can act safely */}
                    {activeTab === "password"   && <ChangePasswordTab onClose={onClose} logout={logout} />}
                    {activeTab === "membership" && <MembershipTab user={user} onClose={onClose} />}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Edit Profile Tab ──────────────────────────────────────── */
function EditProfileTab({
  user,
  updateUser,
}: {
  user: ReturnType<typeof useAuth>["user"] & object;
  updateUser: ReturnType<typeof useAuth>["updateUser"];
}) {
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "+63", // Default prefix 
  });
  
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put('/api/user/update', form, {
        withCredentials: true
      });

      if (response.data) {
        updateUser(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-white mb-1">Personal Information</h3>
        <p className="text-xs text-gray-500">Update your name, email, and contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => {
                // 🔥 FIX: Clean and Auto-Capitalize
                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                setForm({ ...form, firstName: toTitleCase(cleanValue) });
              }}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="First name"
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => {
                // 🔥 FIX: Clean and Auto-Capitalize
                const cleanValue = e.target.value.replace(/[^a-zA-Z\s.-]/g, "").trimStart();
                setForm({ ...form, lastName: toTitleCase(cleanValue) });
              }}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => {
                // 🔥 FIX: Lock +63 and restrict to numbers only
                let val = e.target.value;
                if (!val.startsWith("+63")) val = "+63"; 
                const digits = val.slice(3).replace(/\D/g, ""); 
                const limitedDigits = digits.slice(0, 10); 
                setForm({ ...form, phone: "+63" + limitedDigits });
              }}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="+63 9XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" />
            Changes Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Change Password Tab ───────────────────────────────────── */
function ChangePasswordTab({ onClose, logout }: { onClose: () => void, logout: () => void }) {
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const strength = getPasswordStrength(form.newPw);

  const handleSave = async () => {
    setError("");
    if (!form.current) { setError("Please enter your current password."); return; }
    if (form.newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPw !== form.confirm) { setError("Passwords do not match."); return; }

    setIsSaving(true);

    try {
     await axios.put('/api/user/password', { // 🔥 NEW, PROTECTED endpoint in UserController
      current: form.current,
      newPw: form.newPw
      }, { withCredentials: true });

      // 🔥 FIX: Cleanly resolve the modal and force re-authentication for security
      setSaved(true);
      setTimeout(() => {
        onClose(); // Close modal
        logout();  // Clear auth context
        navigate('/login'); // Send back to login
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password.");
      setIsSaving(false);
    } 
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    showKey: keyof typeof show
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type={show[showKey] ? "text" : "password"}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white outline-none transition-colors"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-white mb-1">Change Password</h3>
        <p className="text-xs text-gray-500">Choose a strong password to keep your account secure. You will be asked to log in again after changing it.</p>
      </div>

      <div className="space-y-4">
        {field("current", "Current Password", "Enter current password", "current")}
        {field("newPw", "New Password", "Enter new password", "newPw")}

        {/* Strength meter */}
        {form.newPw.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.color : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Strength:{" "}
              <span
                className={
                  strength.score <= 1 ? "text-red-400"
                  : strength.score <= 2 ? "text-yellow-400"
                  : strength.score <= 3 ? "text-blue-400"
                  : "text-green-400"
                }
              >
                {strength.label || "—"}
              </span>
            </p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {[
                [/.{8,}/, "At least 8 characters"],
                [/[A-Z]/, "One uppercase letter"],
                [/[0-9]/, "One number"],
                [/[^A-Za-z0-9]/, "One special character"],
              ].map(([regex, text]) => (
                <li key={String(text)} className="flex items-center gap-1.5">
                  <Check
                    className={`w-3 h-3 ${
                      (regex as RegExp).test(form.newPw) ? "text-green-500" : "text-gray-700"
                    }`}
                  />
                  <span className={(regex as RegExp).test(form.newPw) ? "text-gray-400" : ""}>
                    {String(text)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {field("confirm", "Confirm New Password", "Re-enter new password", "confirm")}

        {/* Match indicator */}
        {form.confirm.length > 0 && (
          <p className={`text-xs flex items-center gap-1.5 ${form.newPw === form.confirm ? "text-green-400" : "text-red-400"}`}>
            {form.newPw === form.confirm
              ? <><Check className="w-3 h-3" /> Passwords match</>
              : "Passwords do not match"}
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" />
            Password Updated!
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Update Password
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Manage Membership & Billing Tab ───────────────────────── */
function MembershipTab({
  user,
  onClose,
}: {
  user: ReturnType<typeof useAuth>["user"] & object;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  
  const currentPlan = user?.membership ?? null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/payments/history');
        if (response.data.success) {
          setPayments(response.data.payments);
        }
      } catch (error) {
        console.error("Failed to fetch payment history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDownloadReceipt = async (paymentId: number, transactionId: string) => {
    setDownloadingId(paymentId);
    try {
      const response = await axios.get(`/api/payments/${paymentId}/receipt`, {
        responseType: 'blob',
        headers: { 'Accept': 'application/pdf' }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EmberGym_Receipt_${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download receipt.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getPlanDetails = (plan: string) => {
    if (plan === "Pro") return { icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
    if (plan === "Elite") return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { icon: Dumbbell, color: "text-gray-300", bg: "bg-gray-800", border: "border-gray-700" };
  };

  const planDetails = currentPlan ? getPlanDetails(currentPlan) : null;
  const Icon = planDetails?.icon || Dumbbell;

  return (
    <div className="p-6 space-y-6">
      
      {/* Current Plan Section */}
      <div>
        <h3 className="font-semibold text-white mb-3">Current Plan</h3>
        {!currentPlan ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-400 mb-4">You don't have an active membership yet.</p>
            <button
              onClick={() => { onClose(); navigate("/membership"); }}
              className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              View Plans
            </button>
          </div>
        ) : (
          <div className={`border rounded-xl p-5 ${planDetails?.bg} ${planDetails?.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-black/50 ${planDetails?.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Active Membership</p>
                  <p className={`text-xl font-bold ${planDetails?.color}`}>{currentPlan}</p>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate("/membership"); }}
                className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-white/10 rounded-lg text-sm text-white font-medium transition-colors"
              >
                Change Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Billing History Section */}
      <div>
        <h3 className="font-semibold text-white mb-3">Billing History</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No payment history found.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 p-2.5 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm capitalize">Ember Gym {payment.plan}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{new Date(payment.paid_at).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span className="font-mono bg-black px-1.5 py-0.5 rounded text-gray-500">{payment.transaction_id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0">
                  <span className="font-bold text-white">₱{(payment.total_amount / 100).toFixed(2)}</span>
                  <button
                    onClick={() => handleDownloadReceipt(payment.id, payment.transaction_id)}
                    disabled={downloadingId === payment.id}
                    className="flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingId === payment.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    {downloadingId === payment.id ? "Downloading..." : "PDF Receipt"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}