import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What's included in the free 7-day trial?",
      answer: "Your free 7-day trial includes full access to all gym equipment, group classes, locker rooms, and amenities. You'll also get a complimentary fitness assessment and personalized workout plan from one of our expert trainers.",
    },
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes! We offer flexible month-to-month memberships with no long-term contracts. You can cancel anytime with 30 days notice. We believe in earning your membership every single month.",
    },
    {
      question: "Do you offer personal training?",
      answer: "Absolutely! We have a team of certified personal trainers specializing in various areas including weight loss, strength training, sports performance, and rehabilitation. Personal training sessions can be purchased in packages or added to your membership.",
    },
    {
      question: "What are your gym hours?",
      answer: "We're open 24/7, 365 days a year! Our staffed hours are Monday-Friday 5am-11pm, Saturday-Sunday 7am-9pm. Outside these hours, members have keycard access to the facility.",
    },
    {
      question: "Is there parking available?",
      answer: "Yes, we offer free parking for all members in our dedicated parking lot. We also have bike racks and are easily accessible by public transportation.",
    },
    {
      question: "What COVID-19 safety measures are in place?",
      answer: "Your safety is our priority. We maintain enhanced cleaning protocols, provide sanitizing stations throughout the facility, ensure proper ventilation, and have implemented equipment spacing. We also offer off-peak hour discounts to help with social distancing.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about Ember Gym
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            Our team is here to help you find the perfect fitness solution.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
