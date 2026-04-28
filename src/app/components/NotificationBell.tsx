import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, CreditCard, Calendar, Loader2 } from 'lucide-react'; // 🔥 Added Loader2
import api from '../../config/api';
import { useAuth } from '../context/AuthContext';

// Interfaces mapping to Laravel's default notification structure
interface NotificationData {
  type: string;
  message: string;
}

interface AppNotification {
  id: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isMarkingRead, setIsMarkingRead] = useState(false); // 🔥 NEW: Loading state tracker
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 SAFETY SHIELD 1: Prevent crash if notifications is undefined/object
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n.read_at === null).length 
    : 0;
    
  const { user } = useAuth();

  // Listen for custom signals from anywhere in the app!
  useEffect(() => {
    const handleUpdate = () => {
      fetchNotifications(); 
    };

    // Listen to BOTH bookings and our new universal refresh signal
    window.addEventListener("booking-updated", handleUpdate);
    window.addEventListener("refresh-notifications", handleUpdate);
    
    return () => {
      window.removeEventListener("booking-updated", handleUpdate);
      window.removeEventListener("refresh-notifications", handleUpdate);
    };
  }, []);

  // Wipe memory on logout, fetch fresh on login
  useEffect(() => {
    if (!user) {
      setNotifications([]);
    } else {
      setTimeout(() => {
        fetchNotifications();
      }, 500);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications', {
          withCredentials: true,
      });
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  const markAllAsRead = async () => {
    setIsMarkingRead(true); // 🔥 START LOADING ANIMATION
    try {
      await api.post('/api/notifications/mark-read', {}, {
          withCredentials: true,
      });
      // Update UI to show all as read instantly
      setNotifications(prev => Array.isArray(prev) ? prev.map(n => ({ ...n, read_at: new Date().toISOString() })) : []);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setIsMarkingRead(false); // 🔥 STOP LOADING ANIMATION
    }
  };

  const getIcon = (type: string) => {
    if (type?.includes('booking')) return <Calendar className="w-4 h-4 text-orange-400" />;
    if (type?.includes('payment')) return <CreditCard className="w-4 h-4 text-green-400" />;
    return <Bell className="w-4 h-4 text-gray-400" />;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-orange-500/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-orange-500/10">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                disabled={isMarkingRead} // 🔥 DISABLE BUTTON WHILE LOADING
                className="text-xs text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* 🔥 DYNAMIC ICON AND TEXT */}
                {isMarkingRead ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Marking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" /> Mark all read
                  </>
                )}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {safeNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              safeNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`px-4 py-3 border-b border-orange-500/5 hover:bg-gray-800 transition-colors ${!notif.read_at ? 'bg-orange-500/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIcon(notif.data?.type)}
                    </div>
                    <div>
                      <p className={`text-sm ${!notif.read_at ? 'text-white font-medium' : 'text-gray-300'}`}>
                        {notif.data?.message || 'New notification'}
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">{formatTime(notif.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}