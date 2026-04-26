import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Equipment");

  const transformationGallery = [
    {
      id: 1,
      name: "Wesley C.",
      before: "images/TransformationImg/Before_Caya'.jpeg",
      after: "images/TransformationImg/After_Caya.png", 
      duration: "6 months",
      weightLost: "10 lbs",
      testimonial: "Ember Gym changed my life! The trainers are amazing and the community is so supportive.",
    },
    {
      id: 2,
      name: "Obi B.",
      before: "images/TransformationImg/Before_Benedicto.jpeg",
      after: "images/TransformationImg/After_Benedicto.jpg",
      duration: "9 months",
      weightLost: "50 lbs",
      testimonial: "I gained so much confidence and strength. Best investment I've ever made!",
    },
    {
      id: 3,
      name: "Shaun Y.",
      before: "images/TransformationImg/Before_baruela.png",
      after: "images/TransformationImg/After_baruela.jpg",
      duration: "4 months",
      weightLost: "25 lbs",
      testimonial: "The nutrition plan combined with personal training got me results I never thought possible!",
    },
  ];

  const facilityImages = [
    {
      id: 1,
      url: "images/EquipmentImg/Equipment.jpg",
      category: "Equipment",
      title: "Barbell Rack and Free Weights",
    },
    {
      id: 2,
      url: "images/EquipmentImg/Equipment2.jpg",
      category: "Equipment",
      title: "Dumbbell Rack",
    },
    {
      id: 3,
      url: "images/EquipmentImg/Equipment3.jpg",
      category: "Equipment",
      title: "Lat Pulldown Machine",
    },
    {
      id: 4,
      url: "images/ClassesImg/BoxingTraining.jpg",
      category: "Classes",
      title: "Boxing Area",
    },
    {
      id: 5,
      url: "images/TrainingImg/CardioTraining.jpg",
      category: "Training",
      title: "Cardio Training",
    },
    {
      id: 6,
      url: "images/TrainingImg/PersonalTraining.jpg",
      category: "Training",
      title: "Personal Training",
    },
    {
      id: 7,
      url: "images/ClassesImg/ZumbaDance.jpg",
      category: "Classes",
      title: "Zumba Dance Studio",
    },
    {
      id: 8,
      url: "images/FacilityImg/RestroomsAndLockers.jpg",
      category: "Facility",
      title: "Restrooms and Lockers",
    },
    {
      id: 9,
      url: "images/FacilityImg/Reception.jpg",
      category: "Facility",
      title: "Entrance Reception Area",
    },
  ];

  const categories = ["Equipment", "Classes", "Training", "Facility"];

  // Filter based directly on the local images
  const filteredImages = facilityImages.filter((img) => img.category === selectedCategory);

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