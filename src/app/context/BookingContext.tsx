import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { SCHEDULE, CLASSES } from "../data/gymDatabase";
import api from "../../config/api";

export interface Booking {
  bookingId: string;      // unique
  scheduleId: number;     // references live db id
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
  monthlyCount: number; // 🔥 UPDATED: Tracks monthly bookings instead of weekly
  isLoadingBookings: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isLoggedIn) {
        setBookings([]);
        setIsLoadingBookings(false);
        return;
      }

      setIsLoadingBookings(true);
      try {
        const response = await api.get('/api/my-bookings');        
        const dbBookings = Array.isArray(response.data) ? response.data : [];

        const formattedBookings: Booking[] = dbBookings.map((dbBooking: any) => {
          const classInfo = CLASSES.find(c => c.name === dbBooking.class_name);
          const scheduleInfo = SCHEDULE.find(s => s.id === dbBooking.schedule_id);

          return {
            bookingId: dbBooking.id?.toString() || Math.random().toString(), 
            scheduleId: dbBooking.schedule_id,
            classId: classInfo?.id || 0,
            className: dbBooking.class_name || 'Unknown Class',
            type: dbBooking.class_type || 'General',
            instructor: classInfo?.instructor || scheduleInfo?.instructor || 'TBA',
            day: dbBooking.schedule_day || 'Any',
            time: dbBooking.schedule_time || 'TBA',
            duration: classInfo?.duration || 60,
            room: dbBooking.room || 'Main Studio'
          };
        });

        setBookings(formattedBookings);
      } catch (error) {
        console.error("Failed to fetch schedule from database:", error);
        setBookings([]); 
      } finally {
        setIsLoadingBookings(false); 
      }
    };

    fetchBookings();
  }, [isLoggedIn]);

  const addBooking = (b: Omit<Booking, "bookingId">) => {
    const bookingId = `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setBookings((prev) => [...prev, { ...b, bookingId }]);
  };

  const removeBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  };

  const isBooked = (scheduleId: number) => bookings.some((b) => b.scheduleId === scheduleId);
  const getBookingBySchedule = (scheduleId: number) => bookings.find((b) => b.scheduleId === scheduleId);

  // 🔥 NEW: Monthly limit tracker
  const monthlyCount = bookings.length;

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, removeBooking, isBooked, getBookingBySchedule, monthlyCount, isLoadingBookings }}
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