import { createContext, useContext, useState, ReactNode } from "react";
import { SCHEDULE, CLASSES } from "../data/gymData";

export interface Booking {
  bookingId: string;      // unique
  scheduleId: number;     // references SCHEDULE[].id
  classId: number;        // references CLASSES[].id
  className: string;
  type: string;
  instructor: string;
  day: string;
  time: string;
  duration: number;
  room: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "bookingId">) => void;
  removeBooking: (bookingId: string) => void;
  isBooked: (scheduleId: number) => boolean;
  getBookingBySchedule: (scheduleId: number) => Booking | undefined;
  weeklyCount: number;
  /** Live spots left for a specific schedule slot */
  getSpotsLeft: (scheduleId: number) => number;
  /** Min spots left across all schedule slots for a given class (for Classes page) */
  getClassMinSpots: (classId: number) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (b: Omit<Booking, "bookingId">) => {
    const bookingId = `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setBookings((prev) => [...prev, { ...b, bookingId }]);
  };

  const removeBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  };

  const isBooked = (scheduleId: number) =>
    bookings.some((b) => b.scheduleId === scheduleId);

  const getBookingBySchedule = (scheduleId: number) =>
    bookings.find((b) => b.scheduleId === scheduleId);

  const weeklyCount = bookings.length;

  const getSpotsLeft = (scheduleId: number): number => {
    const slot = SCHEDULE.find((s) => s.id === scheduleId);
    if (!slot) return 0;
    return slot.spotsLeft - (isBooked(scheduleId) ? 1 : 0);
  };

  const getClassMinSpots = (classId: number): number => {
    const cls = CLASSES.find((c) => c.id === classId);
    if (!cls) return 0;
    const slots = SCHEDULE.filter((s) => s.className === cls.name);
    if (slots.length === 0) return 0;
    return Math.min(...slots.map((s) => getSpotsLeft(s.id)));
  };

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, removeBooking, isBooked, getBookingBySchedule, weeklyCount, getSpotsLeft, getClassMinSpots }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
}