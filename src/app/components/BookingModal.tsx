import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  AlertTriangle,
  Lock,
  Crown,
  Zap,
  Dumbbell,
  ChevronRight,
  LogIn,
  UserPlus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import {
  CLASSES,
  PLAN_WEEKLY_LIMITS,
  canPlanAccessClass,
  ScheduleItem,
  SCHEDULE, 
} from "../data/gymDatabase";
import api from "../../config/api";

/* ─── Types ────────────────────────────────────────────────────────────────── */
export type BookingSource = { kind: "class"; classId: number };
interface Props {
  isOpen: boolean;
  onClose: () => void;
  source: BookingSource | null;
}

/* ─── Plan badge helper ────────────────────────────────────────────────────── */
function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    Basic: "bg-gray-700/60 text-gray-300 border-gray-600",
    Pro:   "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Elite: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  const Icons: Record<string, typeof Dumbbell> = {
    Basic: Dumbbell,
    Pro:   Zap,
    Elite: Crown,
  };
  const Icon = Icons[plan] ?? Dumbbell;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${styles[plan] ?? styles.Basic}`}>
      <Icon className="w-3 h-3" />
      {plan}
    </span>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export function BookingModal({ isOpen, onClose, source }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn, user } = useAuth();
const { addBooking, removeBooking, isBooked, getBookingBySchedule, monthlyCount } = useBookings();
  
  const [selectedSlot, setSelectedSlot] = useState<ScheduleItem | null>(null);
  
  // 🔥 FIXED: These states are now safely inside the component body!
  const [liveSlots, setLiveSlots] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [step, setStep] = useState<"pick" | "confirm" | "success" | "cancel" | "error">("pick");
  const [errorMessage, setErrorMessage] = useState("");

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setStep("pick");
      setSelectedSlot(null);
      setErrorMessage("");
    }
  }, [isOpen, source]);

  /* Close on Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  /* ─── Derive data ─────────────────────────────────────────────────────── */
  const classId = source?.classId;
  const classData = CLASSES.find((c) => c.id === classId);

  useEffect(() => {
    if (isOpen && classData) {
      setIsLoading(true); 
      api.get('/api/public/schedule')
        .then(res => {
          const slotsForThisClass = res.data.filter((c: any) => 
            c.template?.name === classData.name || c.name === classData.name
          );
          
          if (slotsForThisClass.length > 0) {
            const formattedSlots = slotsForThisClass.map((c: any) => {
              const dateObj = new Date(c.class_date);
              return {
                id: c.id, 
                className: classData.name,
                type: classData.type,
                instructor: c.trainer ? `${c.trainer.first_name} ${c.trainer.last_name}` : "TBA",
                time: c.start_time.substring(0, 5),
                day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
                duration: classData.duration,
                room: c.room,
                spotsLeft: c.max_capacity - (c.bookings_count || 0)
              };
            });
            setLiveSlots(formattedSlots);
          } else {
            console.log("Live DB empty. Falling back to local schedule data.");
            const localFallbackSlots = SCHEDULE.filter(s => s.className === classData.name);
            setLiveSlots(localFallbackSlots);
          }
        })
        .catch(err => {
          console.error("Failed to fetch live slots. Falling back to local data.", err);
          const localFallbackSlots = SCHEDULE.filter(s => s.className === classData.name);
          setLiveSlots(localFallbackSlots);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, classData]);

  if (!isOpen || !source) return null;

  const availableSlots = liveSlots;
  const activeSlot = selectedSlot;

  /* ─── Membership gate checks ──────────────────────────────────────────── */
  const plan = user?.membership ?? "Basic";
  const weeklyLimit = PLAN_WEEKLY_LIMITS[plan] ?? 2;
  const atWeeklyLimit = monthlyCount >= weeklyLimit;
  const planAllowed = classData ? canPlanAccessClass(plan, classData) : false;
  const slotAlreadyBooked = activeSlot ? isBooked(activeSlot.id) : false;
  const existingBooking = activeSlot ? getBookingBySchedule(activeSlot.id) : undefined;

/* ─── Actions ─────────────────────────────────────────────────────────── */
  const handleConfirm = async () => {
    if (!activeSlot || !classData || !user) return;

    setIsSubmitting(true); 

    try {
      const payload = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "N/A",
        class_type: activeSlot.type,
        schedule_id: activeSlot.id, 
        schedule_day: activeSlot.day,
        schedule_time: activeSlot.time,
        class_name: activeSlot.className,
        room: activeSlot.room,
        message: "Booked via Ember Gym app"
      };

      const response = await api.post("/api/contact-bookings", payload);

      if (response.status === 200 || response.status === 201) {
        // 🔥 Grab the real ID from the Laravel response
        const realBookingId = response.data.booking_id.toString();

        addBooking({
          bookingId: realBookingId, // 🔥 Pass it into the context
          scheduleId: activeSlot.id,
          classId: classData.id,
          className: activeSlot.className,
          type: activeSlot.type,
          instructor: activeSlot.instructor,
          day: activeSlot.day,
          time: activeSlot.time,
          duration: activeSlot.duration,
          room: activeSlot.room,
        });
        
        window.dispatchEvent(new Event("refresh-notifications"));
        setStep("success");
      }
    } catch (error: any) {
      console.error("Booking failed to save to database:", error);
      
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.error || "You must have an active membership to book.");
        setStep("error"); 
      } else {
        alert("Failed to confirm booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleCancel = async () => {
    if (!existingBooking) return;

    setIsSubmitting(true); 

    try {
      await api.delete(`/api/contact-bookings/${existingBooking.bookingId}`);
      removeBooking(existingBooking.bookingId);

      window.dispatchEvent(new Event("refresh-notifications"));
      setStep("cancel");
    } catch (error) {
      console.error("Failed to cancel booking in database:", error);
      alert("Could not cancel booking. Please try again.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-950 border border-orange-500/20 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/60 overflow-hidden">

              <div className="flex items-center justify-between px-6 py-4 border-b border-orange-500/10">
                <h2 className="font-bold text-white text-lg">
                  {step === "success" ? "Booking Confirmed!" :
                   step === "cancel"  ? "Booking Cancelled" :
                   step === "error"   ? "Action Required" :
                   slotAlreadyBooked  ? "Manage Booking" :
                   "Book a Class"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">

                {!isLoggedIn && (
                  <div className="text-center py-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">Login Required</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      You need an account to book classes at Ember Gym. Sign up for free to get started.
                    </p>
                    <div className="flex gap-3">
                      <Link to="/login" onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"><LogIn className="w-4 h-4" />Log In</Link>
                      <Link to="/signup" onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-orange-500/20 py-3 rounded-xl font-semibold text-sm transition-all"><UserPlus className="w-4 h-4" />Sign Up Free</Link>
                    </div>
                  </div>
                )}

                {isLoggedIn && classData && (
                  <>
                    <div className="flex items-start gap-4 mb-5">
                      <img src={classData.image} alt={classData.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-white">{classData.name}</h3>
                          <PlanBadge plan={plan} />
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{classData.instructor}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{classData.duration} min</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {classData.maxParticipants}</span>
                        </div>
                      </div>
                    </div>

                    {!planAllowed && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-300 text-sm mb-1">Plan Restriction</p>
                            <p className="text-red-400/80 text-xs"><strong>{classData.name}</strong> requires one of: {classData.allowedPlans.join(", ")} plan(s). Your current plan is <strong>{plan}</strong>.</p>
                            <Link to="/membership" onClick={onClose} className="inline-flex items-center gap-1 text-orange-400 text-xs font-medium mt-2 hover:text-orange-300 transition-colors">Upgrade your plan <ChevronRight className="w-3 h-3" /></Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {planAllowed && atWeeklyLimit && plan === "Basic" && !slotAlreadyBooked && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-yellow-300 text-sm mb-1">Weekly Limit Reached</p>
                            <p className="text-yellow-400/80 text-xs">Basic members can book up to <strong>2 classes per week</strong>. You've used all {weeklyLimit} slots.</p>
                            <Link to="/membership" onClick={onClose} className="inline-flex items-center gap-1 text-orange-400 text-xs font-medium mt-2 hover:text-orange-300 transition-colors">Upgrade for unlimited classes <ChevronRight className="w-3 h-3" /></Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {plan === "Basic" && planAllowed && !slotAlreadyBooked && step !== "error" && (
                      <div className="bg-gray-900 rounded-xl p-3 mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>Weekly bookings used</span>
                          <span className={monthlyCount >= 2 ? "text-red-400 font-semibold" : "text-orange-400"}>{monthlyCount} / {weeklyLimit}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${monthlyCount >= 2 ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-red-500"}`} style={{ width: `${Math.min((monthlyCount / weeklyLimit) * 100, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {(step === "success" || step === "cancel") && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-xl p-5 text-center mb-4 ${step === "success" ? "bg-green-500/10 border border-green-500/20" : "bg-gray-800/60 border border-gray-700"}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${step === "success" ? "bg-green-500/20" : "bg-gray-700"}`}>
                          {step === "success" ? <Check className="w-6 h-6 text-green-400" /> : <Trash2 className="w-6 h-6 text-gray-400" />}
                        </div>
                        <p className="font-semibold text-white mb-1">{step === "success" ? "You're all set!" : "Booking removed"}</p>
                        <p className="text-sm text-gray-400">{step === "success" && activeSlot ? `${activeSlot.className} on ${activeSlot.day} at ${activeSlot.time} has been added to your schedule.` : "Your booking has been cancelled. The spot is now available."}</p>
                        {step === "success" ? (
                           <Link to="/schedule" onClick={onClose} className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all inline-block">View My Schedule</Link>
                        ) : (
                          <button onClick={onClose} className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">Close</button>
                        )}
                      </motion.div>
                    )}

                    {step === "error" && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-5 text-center mb-4 bg-red-500/10 border border-red-500/20">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-500/20">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <p className="font-semibold text-white mb-1">Membership Required</p>
                        <p className="text-sm text-red-400/80">{errorMessage}</p>
                        
                        <div className="flex gap-3 mt-5">
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm font-medium transition-colors">Close</button>
                            <Link to="/membership" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 text-white">
                                Get Membership
                            </Link>
                        </div>
                      </motion.div>
                    )}

                    {step !== "success" && step !== "cancel" && step !== "error" && slotAlreadyBooked && activeSlot && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-2 rounded-lg"><Check className="w-4 h-4 text-green-400" /></div>
                          <div>
                            <p className="font-semibold text-green-300 text-sm">Already Booked</p>
                            <p className="text-green-400/70 text-xs">{activeSlot.day} at {activeSlot.time} · {activeSlot.room}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === "pick" && planAllowed && !slotAlreadyBooked && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-400 mb-2">Select a time slot</p>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {isLoading ? (
                            <p className="text-sm text-gray-500 text-center py-4">Loading slots...</p>
                          ) : availableSlots.length === 0 ? (
                            <p className="text-sm text-orange-400 text-center py-4">No classes scheduled right now. Check back later!</p>
                          ) : (
                              availableSlots.map((slot: ScheduleItem) => {
                                const booked = isBooked(slot.id);
                              const isSelected = selectedSlot?.id === slot.id;
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => !booked && setSelectedSlot(slot)}
                                  disabled={booked}
                                  className={`w-full text-left rounded-xl border p-3 transition-all ${booked ? "border-green-500/20 bg-green-500/5 opacity-70 cursor-default" : isSelected ? "border-orange-500 bg-orange-500/10" : "border-gray-700 bg-gray-900/50 hover:border-orange-500/50"}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-orange-500" : booked ? "bg-green-500/20" : "bg-gray-800"}`}>
                                        {booked ? <Check className="w-4 h-4 text-green-400" /> : <Calendar className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-500"}`} />}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-white">{slot.day}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                          <Clock className="w-3 h-3" />{slot.time}
                                          <MapPin className="w-3 h-3 ml-1" />{slot.room}
                                        </div>
                                      </div>
                                    </div>
                                    {booked && <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Booked</span>}
{!booked && <span className="text-xs text-gray-500">{slot.spotsLeft} spots</span>}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {step === "pick" && (
                      <div className="flex gap-3">
                        {slotAlreadyBooked && (
                          <>
                            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm font-medium transition-colors">Keep Booking</button>
                            <button onClick={handleCancel} className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Cancel Booking</button>
                          </>
                        )}
                        {!slotAlreadyBooked && planAllowed && (
                          <>
                            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm font-medium transition-colors">Close</button>
                            <button onClick={handleConfirm} disabled={!selectedSlot || atWeeklyLimit || isSubmitting} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                              {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</> : <><Check className="w-4 h-4" />{!selectedSlot ? "Select a Slot" : "Confirm Booking"}</>}
                            </button>
                          </>
                        )}
                        {!planAllowed && (
                          <Link to="/membership" onClick={onClose} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-semibold text-sm text-center hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"><Crown className="w-4 h-4" />Upgrade Plan</Link>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}