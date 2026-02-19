import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const baseUrl = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';

  function normalizeUrl(u: string | undefined) {
    if (!u) return u;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    // if already includes baseUrl, return as-is
    if (baseUrl !== '/' && u.startsWith(baseUrl)) return u;
    if (u.startsWith('/')) {
      return baseUrl.replace(/\/$/, '') + u;
    }
    return baseUrl + u;
  }

  const transformationGallery = [
    {
      id: 1,
      name: "Wesley C.",
      before: normalizeUrl('/images/received_1393216615124102.svg'),
      after: normalizeUrl('/images/IMG_20251213_050239.svg'),
      duration: "6 months",
      weightLost: "10 lbs",
      testimonial: "Ember Gym changed my life! The trainers are amazing and the community is so supportive.",
    },
    {
      id: 2,
      name: "Heart I.",
      before: "https://images.unsplash.com/photo-1734668484998-c943d1fcb48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc2Zvcm1hdGlvbiUyMGJlZm9yZSUyMGFmdGVyJTIwZml0bmVzc3xlbnwxfHx8fDE3NzAyNzE2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      after: "https://images.unsplash.com/photo-1626807020058-30eb4ef93c84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhbnNmb3JtYXRpb24lMjBzdHJvbmd8ZW58MXx8fHwxNzcwMjcxNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "9 months",
      weightLost: "50 lbs",
      testimonial: "I gained so much confidence and strength. Best investment I've ever made!",
    },
    {
      id: 3,
      name: "Shaun Y.",
      before: normalizeUrl('/images/received_1393216615124102.svg'),
      after: normalizeUrl('/images/IMG_20251213_050239.svg'),
      duration: "4 months",
      weightLost: "25 lbs",
      testimonial: "The nutrition plan combined with personal training got me results I never thought possible!",
    },
  ];

  const facilityImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1676109829011-a9f0f3e40f00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzfGVufDF8fHx8MTc3MDIwODUyMXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Equipment",
      title: "State-of-the-art Equipment",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1758798458123-7b4fbcc92c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2xhc3MlMjBncm91cHxlbnwxfHx8fDE3NzAxODM5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Classes",
      title: "Group Fitness Classes",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1761971975769-97e598bf526b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzAxODU5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Facility",
      title: "Modern Gym Interior",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1620188500179-32ac33c60848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc3MDI3MTcxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Training",
      title: "Personal Training Sessions",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1642645550550-c2a442d17e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3R1ZGlvJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcwMjEyODg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Classes",
      title: "Yoga Studio",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1716307046875-4c4ba2f43cab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3hpbmclMjBneW0lMjBwdW5jaGluZyUyMGJhZ3xlbnwxfHx8fDE3NzAyNzE3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Equipment",
      title: "Boxing Area",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1760031670160-4da44e9596d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluJTIwY3ljbGluZyUyMGNsYXNzfGVufDF8fHx8MTc3MDE5OTY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Classes",
      title: "Cycling Studio",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1734189605012-f03d97a4d98f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dCUyMGF0aGxldGV8ZW58MXx8fHwxNzcwMjA5NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Training",
      title: "Functional Training Zone",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMGVxdWlwbWVudCUyMG1vZGVybnxlbnwxfHx8fDE3NzAyNzE0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Equipment",
      title: "Cardio Section",
    },
  ];

  const [apiFacilityImages, setApiFacilityImages] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
          if (cancelled) return;
          if (Array.isArray(data) && data.length > 0) {
            setApiFacilityImages(
              data.map((r: any) => ({ id: r.id, url: normalizeUrl(r.url || r.image_url || r.imageUrl), category: r.category || 'Gallery', title: r.title || r.description || '' }))
            );
          }
        })
      .catch(() => {
        // ignore network errors, keep local fallback
      });
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", "Equipment", "Classes", "Training", "Facility"];

  const sourceImages = apiFacilityImages.length ? apiFacilityImages : facilityImages;
  const filteredImages =
    selectedCategory === "All"
      ? sourceImages
      : sourceImages.filter((img) => img.category === selectedCategory);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    );
  }

  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
    );
  }

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
              Success <span className="text-orange-500">Gallery</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real transformations from real people. See the incredible results our members have achieved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Transformation Slider */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Member <span className="text-orange-500">Transformations</span>
            </h2>
            <p className="text-xl text-gray-400">
              Before and after success stories that inspire
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl overflow-hidden">
            <Slider {...sliderSettings}>
              {transformationGallery.map((transformation) => (
                <div key={transformation.id} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Before/After Images */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">BEFORE</p>
                        <div className="relative h-96 rounded-xl overflow-hidden">
                          <img
                            src={transformation.before}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-red-500/90 px-3 py-1 rounded-full text-sm font-semibold">
                            Before
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">AFTER</p>
                        <div className="relative h-96 rounded-xl overflow-hidden">
                          <img
                            src={transformation.after}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-green-500/90 px-3 py-1 rounded-full text-sm font-semibold">
                            After
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="flex flex-col justify-center">
                      <Quote className="w-12 h-12 text-orange-500 mb-4" />
                      <h3 className="text-3xl font-bold mb-4">
                        {transformation.name}
                      </h3>
                      <div className="flex gap-6 mb-6">
                        <div>
                          <p className="text-3xl font-bold text-orange-500">
                            {transformation.weightLost}
                          </p>
                          <p className="text-sm text-gray-400">Weight Lost</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-orange-500">
                            {transformation.duration}
                          </p>
                          <p className="text-sm text-gray-400">Duration</p>
                        </div>
                      </div>
                      <p className="text-xl text-gray-300 italic mb-6">
                        "{transformation.testimonial}"
                      </p>
                      <button className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all self-start">
                        Start Your Transformation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-orange-500">Facility</span>
            </h2>
            <p className="text-xl text-gray-400">
              Explore our world-class gym facilities
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(image.id)}
                className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm text-orange-500 font-medium mb-1">
                    {image.category}
                  </p>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={
                facilityImages.find((img) => img.id === selectedImage)?.url
              }
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}