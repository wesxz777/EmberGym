import { useState, useEffect } from "react";

export function Schedule() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch(() => setSchedules([]));
  }, []);

  return (
    <div>
      <h1>Class Schedules</h1>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            {schedule.className} with {schedule.trainer} on {schedule.date} at {schedule.time} ({schedule.location})
          </li>
        ))}
      </ul>
    </div>
  );
}
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


