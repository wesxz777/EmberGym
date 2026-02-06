import { useState } from "react";
import { Clock, Users, TrendingUp, Filter, Heart, Zap, Flame } from "lucide-react";
import { motion } from "motion/react";

interface ClassData {
  id: number;
  name: string;
  type: string;
  duration: number;
  intensity: string;
  maxParticipants: number;
  instructor: string;
  description: string;
  image: string;
  benefits: string[];
}

export function Classes() {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedIntensity, setSelectedIntensity] = useState<string>("All");

  const classes: ClassData[] = [
    {
      id: 1,
      name: "Power Yoga Flow",
      type: "Yoga",
      duration: 60,
      intensity: "Medium",
      maxParticipants: 20,
      instructor: "Sarah Johnson",
      description: "Dynamic vinyasa flow combining strength, flexibility, and mindfulness.",
      image: "https://images.unsplash.com/photo-1651077837628-52b3247550ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBzdHVkaW98ZW58MXx8fHwxNzcwMjI2NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Increased flexibility", "Stress relief", "Core strength"],
    },
    {
      id: 2,
      name: "HIIT Blast",
      type: "HIIT",
      duration: 45,
      intensity: "High",
      maxParticipants: 15,
      instructor: "Mike Chen",
      description: "High-intensity interval training to maximize calorie burn and boost metabolism.",
      image: "https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWl0JTIwdHJhaW5pbmclMjBpbnRlbnNlfGVufDF8fHx8MTc3MDIxMjg2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Fat burning", "Cardiovascular health", "Endurance"],
    },
    {
      id: 3,
      name: "Strength Builder",
      type: "Strength",
      duration: 60,
      intensity: "High",
      maxParticipants: 12,
      instructor: "Alex Rodriguez",
      description: "Build lean muscle and increase overall strength with progressive resistance training.",
      image: "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMHRyYWluaW5nJTIwd2VpZ2h0bGlmdGluZ3xlbnwxfHx8fDE3NzAyNzE1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Muscle building", "Bone density", "Metabolism boost"],
    },
    {
      id: 4,
      name: "Cardio Cycling",
      type: "Cardio",
      duration: 45,
      intensity: "Medium",
      maxParticipants: 25,
      instructor: "Emily Davis",
      description: "High-energy cycling class with motivating music and inspiring instructors.",
      image: "https://images.unsplash.com/photo-1761971976282-b2bb051a5474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBzcGlubmluZyUyMGN5Y2xpbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Cardiovascular fitness", "Lower body strength", "Calorie burn"],
    },
    {
      id: 5,
      name: "Core Pilates",
      type: "Pilates",
      duration: 50,
      intensity: "Low",
      maxParticipants: 15,
      instructor: "Jessica Lee",
      description: "Focus on core strength, posture, and flexibility through controlled movements.",
      image: "https://images.unsplash.com/photo-1754258167836-6878c54e316c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcwMjI2NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Core stability", "Posture improvement", "Mind-body connection"],
    },
    {
      id: 6,
      name: "Boxing Cardio",
      type: "Cardio",
      duration: 55,
      intensity: "High",
      maxParticipants: 18,
      instructor: "Marcus Stone",
      description: "Learn boxing techniques while getting an incredible full-body workout.",
      image: "https://images.unsplash.com/photo-1734191797121-de71b48ba038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3hpbmclMjBmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Full-body workout", "Stress relief", "Coordination"],
    },
    {
      id: 7,
      name: "CrossFit WOD",
      type: "HIIT",
      duration: 60,
      intensity: "High",
      maxParticipants: 12,
      instructor: "David Park",
      description: "Constantly varied functional movements performed at high intensity.",
      image: "https://images.unsplash.com/photo-1467818488384-3a21f2b79959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2ZpdCUyMHdvcmtvdXR8ZW58MXx8fHwxNzcwMjcxNTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Functional fitness", "Community", "Overall conditioning"],
    },
    {
      id: 8,
      name: "Zumba Dance Party",
      type: "Cardio",
      duration: 45,
      intensity: "Medium",
      maxParticipants: 30,
      instructor: "Sofia Martinez",
      description: "Dance-based cardio workout featuring Latin and international music.",
      image: "https://images.unsplash.com/photo-1759375201813-572504b6ba9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dW1iYSUyMGRhbmNlJTIwZml0bmVzc3xlbnwxfHx8fDE3NzAyNzE1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      benefits: ["Cardiovascular health", "Coordination", "Fun & social"],
    },
  ];

  const classTypes = ["All", "Yoga", "HIIT", "Strength", "Cardio", "Pilates"];
  const intensityLevels = ["All", "Low", "Medium", "High"];

  const filteredClasses = classes.filter((classItem) => {
    const typeMatch = selectedType === "All" || classItem.type === selectedType;
    const intensityMatch =
      selectedIntensity === "All" || classItem.intensity === selectedIntensity;
    return typeMatch && intensityMatch;
  });

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case "Low":
        return Heart;
      case "Medium":
        return Zap;
      case "High":
        return Flame;
      default:
        return Heart;
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "Low":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "High":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
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
              Our <span className="text-orange-500">Classes</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From high-intensity training to relaxing yoga, find the perfect class to match your fitness goals and lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-sm border-b border-orange-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Filter Classes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Class Type
              </label>
              <div className="flex flex-wrap gap-2">
                {classTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedType === type
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Intensity Level
              </label>
              <div className="flex flex-wrap gap-2">
                {intensityLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedIntensity(level)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedIntensity === level
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classItem, index) => {
              const IntensityIcon = getIntensityIcon(classItem.intensity);
              return (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={classItem.image}
                      alt={classItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {classItem.type}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{classItem.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {classItem.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{classItem.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Max {classItem.maxParticipants}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center gap-2 ${getIntensityColor(classItem.intensity)}`}>
                          <IntensityIcon className="w-4 h-4" />
                          <span>{classItem.intensity}</span>
                        </div>
                        <span className="text-gray-400">{classItem.instructor}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {classItem.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                      Book Class
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                No classes found with the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedType("All");
                  setSelectedIntensity("All");
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
