import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

export type ProfileTab = "profile" | "password" | "membership";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ProfileTab;
}

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

/* ─── Membership plans ──────────────────────────────────────── */
const plans = [
  {
    id: "Basic" as const,
    name: "Basic",
    price: "$29",
    icon: Dumbbell,
    color: "from-gray-700 to-gray-800",
    border: "border-gray-600",
    activeBorder: "border-gray-400",
    badge: "bg-gray-700 text-gray-300",
    perks: ["Access to gym floor", "2 group classes/week", "Locker room access"],
  },
  {
    id: "Pro" as const,
    name: "Pro",
    price: "$59",
    icon: Zap,
    color: "from-orange-600 to-red-700",
    border: "border-orange-500/30",
    activeBorder: "border-orange-500",
    badge: "bg-orange-500/20 text-orange-400",
    perks: ["Everything in Basic", "Unlimited group classes", "1 PT session/month", "Sauna access"],
  },
  {
    id: "Elite" as const,
    name: "Elite",
    price: "$99",
    icon: Crown,
    color: "from-yellow-600 to-amber-700",
    border: "border-yellow-500/30",
    activeBorder: "border-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400",
    perks: [
      "Everything in Pro",
      "4 PT sessions/month",
      "Nutrition coaching",
      "Priority booking",
      "Guest passes",
    ],
  },
];

/* ─── Main component ────────────────────────────────────────── */
export function ProfileModal({ isOpen, onClose, defaultTab = "profile" }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
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
                    {activeTab === "password"   && <ChangePasswordTab />}
                    {activeTab === "membership" && <MembershipTab user={user} updateUser={updateUser} />}
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
    phone: user?.phone ?? "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
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
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30"
        }`}
      >
        {saved ? (
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
function ChangePasswordTab() {
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(form.newPw);

  const handleSave = () => {
    setError("");
    if (!form.current) { setError("Please enter your current password."); return; }
    if (form.newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPw !== form.confirm) { setError("Passwords do not match."); return; }
    setSaved(true);
    setForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setSaved(false), 2500);
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
        <p className="text-xs text-gray-500">Choose a strong password to keep your account secure.</p>
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
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30"
        }`}
      >
        {saved ? (
          <><Check className="w-4 h-4" /> Password Updated!</>
        ) : (
          <><ShieldCheck className="w-4 h-4" /> Update Password</>
        )}
      </button>
    </div>
  );
}

/* ─── Membership Tab ────────────────────────────────────────── */
function MembershipTab({
  user,
  updateUser,
}: {
  user: ReturnType<typeof useAuth>["user"] & object;
  updateUser: ReturnType<typeof useAuth>["updateUser"];
}) {
  const current = user?.membership ?? "Basic";
  const [selected, setSelected] = useState<"Basic" | "Pro" | "Elite">(current);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ membership: selected });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changed = selected !== current;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-white mb-1">Membership Plan</h3>
        <p className="text-xs text-gray-500">
          You're currently on the{" "}
          <span className="text-orange-400 font-medium">{current}</span> plan.
          {" "}Select a plan below to upgrade or downgrade.
        </p>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.id;
          const isCurrent = current === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => { setSelected(plan.id); setSaved(false); }}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                isSelected ? plan.activeBorder + " bg-gray-900/80" : plan.border + " bg-gray-900/30 hover:bg-gray-900/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`bg-gradient-to-br ${plan.color} p-2.5 rounded-lg shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{plan.name}</span>
                    {isCurrent && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.badge}`}>
                        Current
                      </span>
                    )}
                    <span className="ml-auto font-bold text-white">{plan.price}<span className="text-gray-500 font-normal text-xs">/mo</span></span>
                  </div>
                  <ul className="space-y-0.5">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-orange-500 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  isSelected ? "border-orange-500 bg-orange-500" : "border-gray-600"
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={!changed}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : changed
              ? "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        {saved ? (
          <><Check className="w-4 h-4" /> Plan Updated!</>
        ) : (
          <><CreditCard className="w-4 h-4" /> {changed ? `Switch to ${selected}` : "No Changes"}</>
        )}
      </button>
    </div>
  );
}
