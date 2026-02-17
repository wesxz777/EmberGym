import { Award, Star, Instagram, Mail, UserX } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface Trainer {
  id: number;
  name: string;
  role: string;
  specialization: string;
  certification: string;
  experience_years: number;
  bio: string;
  image: string;
  rating: number;
  total_reviews: number;
  hourly_rate?: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/trainers`);
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }
      const data = await response.json();
      setTrainers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
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
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-6 py-4 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Error loading trainers</h3>
              <p>{error}</p>
              <p className="text-sm mt-2 text-gray-400">Make sure the backend server is running on http://localhost:3001</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && trainers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-12 max-w-2xl mx-auto">
                <UserX className="w-20 h-20 text-orange-500/50 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">No Trainers Yet</h2>
                <p className="text-gray-400 text-lg mb-6">
                  We don't have any trainers registered at the moment. Check back soon!
                </p>
                <p className="text-sm text-gray-500">
                  Trainers can be added through the admin panel or API.
                </p>
              </div>
            </motion.div>
          )}

          {/* Trainers Grid */}
          {!loading && !error && trainers.length > 0 && (
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
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-gray-800 to-black border border-orange-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-orange-500">{trainer.experience_years}</p>
                      <p className="text-xs text-gray-400">Years</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-black border border-orange-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-orange-500">{trainer.total_reviews}</p>
                      <p className="text-xs text-gray-400">Reviews</p>
                    </div>
                    {trainer.hourly_rate && trainer.hourly_rate > 0 && (
                      <div className="bg-gradient-to-br from-gray-800 to-black border border-orange-500/20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-500">${trainer.hourly_rate}</p>
                        <p className="text-xs text-gray-400">/hour</p>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {trainer.certification && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        Certification
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded">
                          {trainer.certification}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Specialization */}
                  {trainer.specialization && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 text-gray-300">Specialization</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs border border-orange-500 text-orange-400 px-3 py-1.5 rounded-full font-medium">
                          {trainer.specialization}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Availability Indicator */}
                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-green-400 font-medium">Available for new clients</span>
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
          )}
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
