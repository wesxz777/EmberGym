
import { Calendar, Clock, MapPin, Filter } from "lucide-react";
import { motion } from "motion/react";
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
