
import { useState, useEffect } from "react";

const mockSchedules = [
  {
    id: 1,
    className: "Yoga",
    type: "Yoga",
    day: "Monday",
    time: "08:00",
    duration: 60,
    room: "Studio A",
    instructor: "Sarah Johnson",
    spotsLeft: 5,
  },
  {
    id: 2,
    className: "HIIT",
    type: "HIIT",
    day: "Tuesday",
    time: "10:00",
    duration: 45,
    room: "Studio B",
    instructor: "Mike Chen",
    spotsLeft: 2,
  },
  // Add more mock classes as needed
];

export function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("All");

  useEffect(() => {
    setSchedules(mockSchedules);
  }, []);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const types = ["All", "Yoga", "HIIT", "Strength", "Cardio", "Pilates"];
  const times = ["All", "Morning (6-12)", "Afternoon (12-17)", "Evening (17-21)"];

  const filteredSchedule = schedules.filter((item) => {
    const dayMatch = selectedDay === "All" || item.day === selectedDay;
    const typeMatch = selectedType === "All" || item.type === selectedType;

    let timeMatch = true;
    if (selectedTime !== "All") {
      const hour = parseInt(item.time.split(":")[0]);
      if (selectedTime === "Morning (6-12)") {
        timeMatch = hour >= 6 && hour < 12;
      } else if (selectedTime === "Afternoon (12-17)") {
        timeMatch = hour >= 12 && hour < 17;
      } else if (selectedTime === "Evening (17-21)") {
        timeMatch = hour >= 17 && hour <= 21;
      }
    }
    return dayMatch && typeMatch && timeMatch;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Class <span className="text-orange-500">Schedule</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Plan your week with our comprehensive class schedule. Book your spot today!
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-sm border-b border-orange-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Day of Week
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Class Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Time of Day
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredSchedule.length} {filteredSchedule.length === 1 ? "class" : "classes"}
            </p>
          </div>
          <div className="space-y-4">
            {filteredSchedule.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-900 to-black border rounded-xl p-6 border-orange-500/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{item.className}</h3>
                      <span className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-400">
                      <div>
                        <span className="font-medium">Day:</span> {item.day}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {item.time} ({item.duration} min)
                      </div>
                      <div>
                        <span className="font-medium">Room:</span> {item.room}
                      </div>
                      <div>
                        <span className="font-medium">Instructor:</span> {item.instructor}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{item.spotsLeft}</p>
                    <p className="text-xs text-gray-400">Spots Left</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredSchedule.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                No classes found with the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDay("All");
                  setSelectedType("All");
                  setSelectedTime("All");
                }}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const types = ["All", "Yoga", "HIIT", "Strength", "Cardio", "Pilates"];
  const times = ["All", "Morning (6-12)", "Afternoon (12-17)", "Evening (17-21)"];

  const filteredSchedule = scheduleData.filter((item) => {
    const dayMatch = selectedDay === "All" || item.day === selectedDay;
    const typeMatch = selectedType === "All" || item.type === selectedType;
    
    let timeMatch = true;
    if (selectedTime !== "All") {
      const hour = parseInt(item.time.split(":")[0]);
      if (selectedTime === "Morning (6-12)") {
        timeMatch = hour >= 6 && hour < 12;
      } else if (selectedTime === "Afternoon (12-17)") {
        timeMatch = hour >= 12 && hour < 17;
      } else if (selectedTime === "Evening (17-21)") {
        timeMatch = hour >= 17 && hour <= 21;
      }
    }
    
    return dayMatch && typeMatch && timeMatch;
  });

  // Get current time to highlight current classes
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isCurrentClass = (item: ScheduleItem) => {
    if (item.day !== currentDay) return false;
    const [hour, minute] = item.time.split(":").map(Number);
    const classStart = hour * 60 + minute;
    const classEnd = classStart + item.duration;
    const currentTime = currentHour * 60 + currentMinute;
    return currentTime >= classStart && currentTime < classEnd;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Class <span className="text-orange-500">Schedule</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Plan your week with our comprehensive class schedule. Book your spot today!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-sm border-b border-orange-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Filter Schedule</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Day of Week
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Class Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Time of Day
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-gray-900 border border-orange-500/30 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors"
              >
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredSchedule.length} {filteredSchedule.length === 1 ? "class" : "classes"}
            </p>
          </div>

          <div className="space-y-4">
            {filteredSchedule.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-gradient-to-br from-gray-900 to-black border rounded-xl p-6 hover:border-orange-500/50 transition-all ${
                  isCurrentClass(item)
                    ? "border-orange-500 shadow-lg shadow-orange-500/20"
                    : "border-orange-500/20"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{item.className}</h3>
                      {isCurrentClass(item) && (
                        <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                          LIVE NOW
                        </span>
                      )}
                      <span className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>{item.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{item.time} ({item.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>{item.room}</span>
                      </div>
                      <div>
                        <span className="font-medium">Instructor:</span> {item.instructor}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-500">{item.spotsLeft}</p>
                      <p className="text-xs text-gray-400">Spots Left</p>
                    </div>
                    <button className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all whitespace-nowrap">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSchedule.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                No classes found with the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDay("All");
                  setSelectedType("All");
                  setSelectedTime("All");
                }}
                className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
