import { Award, Star, Instagram, Mail } from "lucide-react";
import { motion } from "motion/react";

interface Trainer {
  id: number;
  name: string;
  role: string;
  specialties: string[];
  certifications: string[];
  experience: string;
  bio: string;
  image: string;
  rating: number;
  clients: number;
}

export function Trainers() {
  const trainers: Trainer[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Yoga & Mindfulness Specialist",
      specialties: ["Vinyasa Yoga", "Power Yoga", "Meditation", "Flexibility"],
      certifications: ["RYT-500", "Mindfulness Coach", "Nutrition Cert"],
      experience: "8 years",
      bio: "Sarah brings a holistic approach to fitness, combining traditional yoga practices with modern strength training techniques.",
      image: "https://images.unsplash.com/photo-1667890786022-83bca6c4f4c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMHdvbWFufGVufDF8fHx8MTc3MDI3MTYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      clients: 150,
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "HIIT & Functional Training Expert",
      specialties: ["HIIT", "Functional Training", "Weight Loss", "Conditioning"],
      certifications: ["NASM-CPT", "CrossFit Level 2", "TRX Certified"],
      experience: "10 years",
      bio: "Mike specializes in high-intensity training programs that deliver real results in minimal time.",
      image: "https://images.unsplash.com/photo-1761258772183-6a905c8b95fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29hY2glMjBhdGhsZXRlfGVufDF8fHx8MTc3MDI3MTYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5.0,
      clients: 200,
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      role: "Strength & Bodybuilding Coach",
      specialties: ["Powerlifting", "Bodybuilding", "Strength Training", "Nutrition"],
      certifications: ["CSCS", "ISSA-CPT", "Sports Nutrition"],
      experience: "12 years",
      bio: "Alex has coached numerous athletes to championship levels and specializes in building lean muscle mass.",
      image: "https://images.unsplash.com/photo-1758875568823-34bdf47b82dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMGNvYWNoJTIwbXVzY3VsYXJ8ZW58MXx8fHwxNzcwMjcxNjE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      clients: 180,
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Cardio & Cycling Instructor",
      specialties: ["Indoor Cycling", "Cardio Training", "Endurance", "Marathon Prep"],
      certifications: ["Spinning Certified", "ACSM-CPT", "Running Coach"],
      experience: "7 years",
      bio: "Emily's high-energy classes are known for their motivating music and transformative results.",
      image: "https://images.unsplash.com/photo-1544972917-3529b113a469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAyNzE2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      clients: 220,
    },
    {
      id: 5,
      name: "Jessica Lee",
      role: "Pilates & Rehabilitation Specialist",
      specialties: ["Mat Pilates", "Reformer", "Injury Prevention", "Posture Correction"],
      certifications: ["PMA Certified", "Physical Therapy Asst", "Pre/Postnatal"],
      experience: "9 years",
      bio: "Jessica helps clients recover from injuries and build core strength through precision-based Pilates.",
      image: "https://images.unsplash.com/photo-1544972917-3529b113a469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAyNzE2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      clients: 140,
    },
    {
      id: 6,
      name: "Marcus Stone",
      role: "Boxing & Martial Arts Coach",
      specialties: ["Boxing", "Kickboxing", "Self-Defense", "Combat Conditioning"],
      certifications: ["Boxing Coach Level 2", "Muay Thai Instructor", "NASM-CPT"],
      experience: "15 years",
      bio: "Former professional boxer Marcus brings authentic fight training to every class.",
      image: "https://images.unsplash.com/photo-1761258772183-6a905c8b95fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29hY2glMjBhdGhsZXRlfGVufDF8fHx8MTc3MDI3MTYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5.0,
      clients: 170,
    },
  ];

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
              Our <span className="text-orange-500">Expert Trainers</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              World-class certified trainers dedicated to helping you achieve your fitness goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all group"
              >
                {/* Trainer Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{trainer.rating}</span>
                  </div>

                  {/* Name & Role */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold mb-1">{trainer.name}</h3>
                    <p className="text-orange-500 font-medium">{trainer.role}</p>
                  </div>
                </div>

                {/* Trainer Details */}
                <div className="p-6">
                  <p className="text-gray-400 mb-4">{trainer.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-800 to-black border border-orange-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-orange-500">{trainer.experience}</p>
                      <p className="text-xs text-gray-400">Experience</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-black border border-orange-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-orange-500">{trainer.clients}+</p>
                      <p className="text-xs text-gray-400">Clients Trained</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                      Book Session
                    </button>
                    <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </button>
                    <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Work with a <span className="text-orange-500">Pro?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Schedule a consultation with one of our expert trainers and start your transformation today.
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all">
              Schedule Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
