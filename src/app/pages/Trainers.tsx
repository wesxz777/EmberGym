import { Award, Star, Instagram, Mail } from "lucide-react";
import { motion } from "motion/react";
import { AuthGate } from "../components/AuthGate";
import { useNavigate } from "react-router"; 

interface Trainer {
  id: number;
  name: string;
  role: string;
  specialties: string[];
  certifications: string[];
  experience: string;
  bio: string;
  image: string;
  clients: number;
}

export function Trainers() {
  const navigate = useNavigate(); 
  const trainers: Trainer[] = [
    {
      id: 1,
      name: "Joana Kristel Hernandez",
      role: "Yoga & Mindfulness Specialist",
      specialties: ["Vinyasa Yoga", "Power Yoga", "Meditation", "Flexibility"],
      certifications: ["RYT-500", "Mindfulness Coach", "Nutrition Cert"],
      experience: "8 years",
      bio: "Joana brings a holistic approach to fitness, combining traditional yoga practices with modern strength training techniques.",
      image: "images/TrainerImg/HernandezTrainer.png",
      clients: 150,
    },
    {
      id: 2,
      name: "Antonio Estor Jr.",
      role: "HIIT & Functional Training Expert",
      specialties: ["HIIT", "Functional Training", "Weight Loss", "Conditioning"],
      certifications: ["NASM-CPT", "CrossFit Level 2", "TRX Certified"],
      experience: "10 years",
      bio: "Estor specializes in high-intensity training programs that deliver real results in minimal time.",
      image: "images/TrainerImg/EstorTrainer.jpg",
      clients: 200,
    },
    {
      id: 3,
      name: "Igor Ducay",
      role: "Strength & Bodybuilding Coach",
      specialties: ["Powerlifting", "Bodybuilding", "Strength Training", "Nutrition"],
      certifications: ["HOPE TEACHER"],
      experience: "12 years",
      bio: "I has coached numerous athletes to championship levels and specializes in building lean muscle mass.",
      image: "images/TrainerImg/IgorTrainer.png",
      clients: 180,
    },
  
  ];

  // Preview cards shown blurred behind the gate (first 3 trainers)
  const PreviewGrid = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.slice(0, 3).map((trainer) => (
          <div
            key={trainer.id}
            className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl overflow-hidden"
          >
            <div className="relative h-80 overflow-hidden">
              <img
                src={trainer.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold">{trainer.name}</h3>
                <p className="text-orange-500">{trainer.role}</p>
              </div>
            </div>
            <div className="p-6 h-40 bg-gradient-to-b from-gray-900 to-black" />
          </div>
        ))}
      </div>
    </div>
  );

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

      {/* Trainers Grid — gated for guests */}
      <AuthGate
        title="Meet Our Expert Trainers"
        description="Log in to explore full trainer profiles, specialties, certifications, and book personal sessions."
        preview={<PreviewGrid />}
      >
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
              <button 
                onClick={() => navigate("/Schedule")} 
                className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all active:scale-95"
                >
                Schedule Consultation
              </button>
            </motion.div>
          </div>
        </section>
      </AuthGate>
    </div>
  );
}