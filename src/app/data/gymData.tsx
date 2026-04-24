// ─── Shared class catalogue ────────────────────────────────────────────────
export interface ClassData {
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
  /** Which membership tiers may book this class */
  allowedPlans: Array<"Basic" | "Pro" | "Elite">;
}

export const CLASSES: ClassData[] = [
  {
    id: 1,
    name: "Power Yoga Flow",
    type: "Yoga",
    duration: 60,
    intensity: "Medium",
    maxParticipants: 20,
    instructor: "Joanna Kristel Hernandez",
    description: "Dynamic vinyasa flow combining strength, flexibility, and mindfulness.",
    image: "https://images.unsplash.com/photo-1651077837628-52b3247550ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBzdHVkaW98ZW58MXx8fHwxNzcwMjI2NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Increased flexibility", "Stress relief", "Core strength"],
    allowedPlans: ["Basic", "Pro", "Elite"],
  },
  {
    id: 2,
    name: "HIIT Blast",
    type: "HIIT",
    duration: 45,
    intensity: "High",
    maxParticipants: 15,
    instructor: "Antonio Estor Jr.",
    description: "High-intensity interval training to maximize calorie burn and boost metabolism.",
    image: "https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWl0JTIwdHJhaW5pbmclMjBpbnRlbnNlfGVufDF8fHx8MTc3MDIxMjg2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Fat burning", "Cardiovascular health", "Endurance"],
    allowedPlans: ["Pro", "Elite"],
  },
  {
    id: 3,
    name: "Strength Builder",
    type: "Strength",
    duration: 60,
    intensity: "High",
    maxParticipants: 12,
    instructor: "Igor Ducay",
    description: "Build lean muscle and increase overall strength with progressive resistance training.",
    image: "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMHRyYWluaW5nJTIwd2VpZ2h0bGlmdGluZ3xlbnwxfHx8fDE3NzAyNzE1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Muscle building", "Bone density", "Metabolism boost"],
    allowedPlans: ["Pro", "Elite"],
  },
  {
    id: 4,
    name: "Cardio Cycling",
    type: "Cardio",
    duration: 45,
    intensity: "Medium",
    maxParticipants: 25,
    instructor: "Joanna Kristel Hernandez",
    description: "High-energy cycling class with motivating music and inspiring instructors.",
    image: "https://images.unsplash.com/photo-1761971976282-b2bb051a5474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW8lMjBzcGlubmluZyUyMGN5Y2xpbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Cardiovascular fitness", "Lower body strength", "Calorie burn"],
    allowedPlans: ["Basic", "Pro", "Elite"],
  },
  {
    id: 5,
    name: "Core Pilates",
    type: "Pilates",
    duration: 50,
    intensity: "Low",
    maxParticipants: 15,
    instructor: "Joanna Kristel Hernandez",
    description: "Focus on core strength, posture, and flexibility through controlled movements.",
    image: "https://images.unsplash.com/photo-1754258167836-6878c54e316c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcwMjI2NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Core stability", "Posture improvement", "Mind-body connection"],
    allowedPlans: ["Basic", "Pro", "Elite"],
  },
  {
    id: 6,
    name: "Boxing Cardio",
    type: "Cardio",
    duration: 55,
    intensity: "High",
    maxParticipants: 18,
    instructor: "Igor Ducay",
    description: "Learn boxing techniques while getting an incredible full-body workout.",
    image: "https://images.unsplash.com/photo-1734191797121-de71b48ba038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3hpbmclMjBmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzcwMjcxNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Full-body workout", "Stress relief", "Coordination"],
    allowedPlans: ["Pro", "Elite"],
  },
  {
    id: 7,
    name: "CrossFit WOD",
    type: "HIIT",
    duration: 60,
    intensity: "High",
    maxParticipants: 12,
    instructor: "Antonio Estor Jr.",
    description: "Constantly varied functional movements performed at high intensity.",
    image: "https://images.unsplash.com/photo-1467818488384-3a21f2b79959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2ZpdCUyMHdvcmtvdXR8ZW58MXx8fHwxNzcwMjcxNTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Functional fitness", "Community", "Overall conditioning"],
    allowedPlans: ["Elite"],
  },
  {
    id: 8,
    name: "Zumba Dance Party",
    type: "Cardio",
    duration: 45,
    intensity: "Medium",
    maxParticipants: 30,
    instructor: "Joanna Kristel Hernandez",
    description: "Dance-based cardio workout featuring Latin and international music.",
    image: "https://images.unsplash.com/photo-1759375201813-572504b6ba9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dW1iYSUyMGRhbmNlJTIwZml0bmVzc3xlbnwxfHx8fDE3NzAyNzE1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    benefits: ["Cardiovascular health", "Coordination", "Fun & social"],
    allowedPlans: ["Basic", "Pro", "Elite"],
  },
];

// ─── Shared weekly schedule ─────────────────────────────────────────────────
export interface ScheduleItem {
  id: number;
  className: string;
  type: string;
  instructor: string;
  time: string;
  day: string;
  duration: number;
  room: string;
  spotsLeft: number;
}

export const SCHEDULE: ScheduleItem[] = [
  // Monday
  { id: 1,  className: "Power Yoga Flow",   type: "Yoga",     instructor: "Sarah Johnson",  time: "06:00", day: "Monday",    duration: 60, room: "Studio A",       spotsLeft: 8  },
  { id: 2,  className: "HIIT Blast",        type: "HIIT",     instructor: "Mike Chen",      time: "09:00", day: "Monday",    duration: 45, room: "Fitness Floor",  spotsLeft: 5  },
  { id: 3,  className: "Cardio Cycling",    type: "Cardio",   instructor: "Emily Davis",    time: "12:00", day: "Monday",    duration: 45, room: "Cycling Studio", spotsLeft: 12 },
  { id: 4,  className: "Strength Builder",  type: "Strength", instructor: "Alex Rodriguez", time: "17:00", day: "Monday",    duration: 60, room: "Weight Room",    spotsLeft: 3  },
  { id: 5,  className: "Core Pilates",      type: "Pilates",  instructor: "Jessica Lee",    time: "19:00", day: "Monday",    duration: 50, room: "Studio B",       spotsLeft: 10 },
  // Tuesday
  { id: 6,  className: "Boxing Cardio",     type: "Cardio",   instructor: "Marcus Stone",   time: "06:30", day: "Tuesday",   duration: 55, room: "Studio A",       spotsLeft: 7  },
  { id: 7,  className: "Power Yoga Flow",   type: "Yoga",     instructor: "Sarah Johnson",  time: "10:00", day: "Tuesday",   duration: 60, room: "Studio B",       spotsLeft: 15 },
  { id: 8,  className: "CrossFit WOD",      type: "HIIT",     instructor: "David Park",     time: "12:30", day: "Tuesday",   duration: 60, room: "Fitness Floor",  spotsLeft: 4  },
  { id: 9,  className: "Zumba Dance Party", type: "Cardio",   instructor: "Sofia Martinez", time: "18:00", day: "Tuesday",   duration: 45, room: "Studio A",       spotsLeft: 20 },
  { id: 10, className: "Strength Builder",  type: "Strength", instructor: "Alex Rodriguez", time: "20:00", day: "Tuesday",   duration: 60, room: "Weight Room",    spotsLeft: 6  },
  // Wednesday
  { id: 11, className: "HIIT Blast",        type: "HIIT",     instructor: "Mike Chen",      time: "06:00", day: "Wednesday", duration: 45, room: "Fitness Floor",  spotsLeft: 8  },
  { id: 12, className: "Core Pilates",      type: "Pilates",  instructor: "Jessica Lee",    time: "09:30", day: "Wednesday", duration: 50, room: "Studio B",       spotsLeft: 12 },
  { id: 13, className: "Cardio Cycling",    type: "Cardio",   instructor: "Emily Davis",    time: "12:00", day: "Wednesday", duration: 45, room: "Cycling Studio", spotsLeft: 18 },
  { id: 14, className: "Boxing Cardio",     type: "Cardio",   instructor: "Marcus Stone",   time: "17:30", day: "Wednesday", duration: 55, room: "Studio A",       spotsLeft: 9  },
  { id: 15, className: "Power Yoga Flow",   type: "Yoga",     instructor: "Sarah Johnson",  time: "19:00", day: "Wednesday", duration: 60, room: "Studio B",       spotsLeft: 11 },
  // Thursday
  { id: 16, className: "CrossFit WOD",      type: "HIIT",     instructor: "David Park",     time: "06:30", day: "Thursday",  duration: 60, room: "Fitness Floor",  spotsLeft: 5  },
  { id: 17, className: "Zumba Dance Party", type: "Cardio",   instructor: "Sofia Martinez", time: "10:00", day: "Thursday",  duration: 45, room: "Studio A",       spotsLeft: 22 },
  { id: 18, className: "Strength Builder",  type: "Strength", instructor: "Alex Rodriguez", time: "12:30", day: "Thursday",  duration: 60, room: "Weight Room",    spotsLeft: 4  },
  { id: 19, className: "Core Pilates",      type: "Pilates",  instructor: "Jessica Lee",    time: "17:00", day: "Thursday",  duration: 50, room: "Studio B",       spotsLeft: 14 },
  { id: 20, className: "HIIT Blast",        type: "HIIT",     instructor: "Mike Chen",      time: "19:30", day: "Thursday",  duration: 45, room: "Fitness Floor",  spotsLeft: 7  },
  // Friday
  { id: 21, className: "Power Yoga Flow",   type: "Yoga",     instructor: "Sarah Johnson",  time: "06:00", day: "Friday",    duration: 60, room: "Studio A",       spotsLeft: 10 },
  { id: 22, className: "Cardio Cycling",    type: "Cardio",   instructor: "Emily Davis",    time: "09:00", day: "Friday",    duration: 45, room: "Cycling Studio", spotsLeft: 16 },
  { id: 23, className: "Boxing Cardio",     type: "Cardio",   instructor: "Marcus Stone",   time: "12:00", day: "Friday",    duration: 55, room: "Studio A",       spotsLeft: 8  },
  { id: 24, className: "CrossFit WOD",      type: "HIIT",     instructor: "David Park",     time: "17:00", day: "Friday",    duration: 60, room: "Fitness Floor",  spotsLeft: 6  },
  { id: 25, className: "Zumba Dance Party", type: "Cardio",   instructor: "Sofia Martinez", time: "19:00", day: "Friday",    duration: 45, room: "Studio A",       spotsLeft: 25 },
  // Saturday
  { id: 26, className: "HIIT Blast",        type: "HIIT",     instructor: "Mike Chen",      time: "08:00", day: "Saturday",  duration: 45, room: "Fitness Floor",  spotsLeft: 10 },
  { id: 27, className: "Power Yoga Flow",   type: "Yoga",     instructor: "Sarah Johnson",  time: "10:00", day: "Saturday",  duration: 60, room: "Studio B",       spotsLeft: 15 },
  { id: 28, className: "Strength Builder",  type: "Strength", instructor: "Alex Rodriguez", time: "12:00", day: "Saturday",  duration: 60, room: "Weight Room",    spotsLeft: 5  },
  // Sunday
  { id: 29, className: "Core Pilates",      type: "Pilates",  instructor: "Jessica Lee",    time: "09:00", day: "Sunday",    duration: 50, room: "Studio B",       spotsLeft: 18 },
  { id: 30, className: "Cardio Cycling",    type: "Cardio",   instructor: "Emily Davis",    time: "11:00", day: "Sunday",    duration: 45, room: "Cycling Studio", spotsLeft: 20 },
];

// ─── Membership rules ──────────────────────────────────────────────────────
export const PLAN_WEEKLY_LIMITS: Record<string, number> = {
  Basic: 2,
  Pro: Infinity,
  Elite: Infinity,
};

/** Plans that may access a given class (from allowedPlans array) */
export function canPlanAccessClass(plan: string, classData: ClassData): boolean {
  return classData.allowedPlans.includes(plan as "Basic" | "Pro" | "Elite");
}
