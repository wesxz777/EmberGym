import { useState, useEffect } from "react";
import { Check, X, Zap, Crown, Star, Clock } from "lucide-react";
import { motion } from "motion/react";
import * as Progress from "@radix-ui/react-progress";

interface Plan {
  id: number;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  icon: typeof Zap;
  features: Array<{ text: string; included: boolean }>;
  buttonText: string;
}

export function MembershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer for limited time offer (ends in 3 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const plans: Plan[] = [
    {
      id: 1,
      name: "Basic",
      price: 29,
      period: "month",
      icon: Zap,
      features: [
        { text: "Access to gym equipment", included: true },
        { text: "Locker room access", included: true },
        { text: "2 group classes per month", included: true },
        { text: "Personal training sessions", included: false },
        { text: "Nutritional guidance", included: false },
        { text: "Free guest passes", included: false },
        { text: "24/7 gym access", included: false },
        { text: "Sauna & spa access", included: false },
      ],
      buttonText: "Get Started",
    },
    {
      id: 2,
      name: "Pro",
      price: 59,
      period: "month",
      popular: true,
      icon: Star,
      features: [
        { text: "Access to gym equipment", included: true },
        { text: "Locker room access", included: true },
        { text: "Unlimited group classes", included: true },
        { text: "2 personal training sessions/month", included: true },
        { text: "Nutritional guidance", included: true },
        { text: "2 free guest passes per month", included: true },
        { text: "24/7 gym access", included: false },
        { text: "Sauna & spa access", included: false },
      ],
      buttonText: "Most Popular",
    },
    {
      id: 3,
      name: "Elite",
      price: 99,
      period: "month",
      icon: Crown,
      features: [
        { text: "Access to gym equipment", included: true },
        { text: "Locker room access", included: true },
        { text: "Unlimited group classes", included: true },
        { text: "4 personal training sessions/month", included: true },
        { text: "Nutritional guidance", included: true },
        { text: "Unlimited guest passes", included: true },
        { text: "24/7 gym access", included: true },
        { text: "Sauna & spa access", included: true },
      ],
      buttonText: "Go Premium",
    },
  ];

  const comparisonFeatures = [
    "Gym Equipment Access",
    "Locker Room",
    "Group Classes",
    "Personal Training",
    "Nutrition Plan",
    "Guest Passes",
    "24/7 Access",
    "Spa & Sauna",
    "Priority Support",
    "Towel Service",
    "Free Smoothie Bar",
  ];

  const comparisonValues = {
    Basic: ["✓", "✓", "2/month", "—", "—", "—", "—", "—", "—", "—", "—"],
    Pro: ["✓", "✓", "Unlimited", "2/month", "✓", "2/month", "—", "—", "✓", "—", "—"],
    Elite: ["✓", "✓", "Unlimited", "4/month", "✓", "Unlimited", "✓", "✓", "✓", "✓", "✓"],
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
              Membership <span className="text-orange-500">Plans</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan to achieve your fitness goals. Cancel anytime, no contracts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Limited Time Offer Banner */}
      <section className="py-8 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold">Limited Time Offer!</h3>
                <p className="text-white/90">Get 50% off your first month on any plan</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="bg-black/30 backdrop-blur-sm px-4 py-3 rounded-lg text-center min-w-[70px]"
                >
                  <div className="text-3xl font-bold">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-white/80">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden ${
                    plan.popular
                      ? "border-2 border-orange-500 shadow-xl shadow-orange-500/20"
                      : "border border-orange-500/20"
                  } ${
                    selectedPlan === plan.id ? "ring-2 ring-orange-500" : ""
                  } hover:border-orange-500/50 transition-all`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 py-2 text-center font-semibold text-sm">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`p-8 ${plan.popular ? "pt-14" : ""}`}>
                    {/* Icon & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-orange-500">
                          ${plan.price}
                        </span>
                        <span className="text-gray-400">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        First month 50% off: ${Math.floor(plan.price / 2)}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feature.included ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-4 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/50"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {selectedPlan === plan.id ? "Selected ✓" : plan.buttonText}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Compare <span className="text-orange-500">Plans</span>
            </h2>
            <p className="text-xl text-gray-400">
              See what's included in each membership tier
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-500/20">
                    <th className="text-left p-6 font-semibold">Features</th>
                    <th className="text-center p-6 font-semibold">Basic</th>
                    <th className="text-center p-6 font-semibold bg-orange-500/10">
                      Pro
                      <span className="block text-xs text-orange-500 font-normal mt-1">
                        Most Popular
                      </span>
                    </th>
                    <th className="text-center p-6 font-semibold">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-orange-500/10 hover:bg-orange-500/5 transition-colors"
                    >
                      <td className="p-6 text-gray-300">{feature}</td>
                      <td className="p-6 text-center text-gray-400">
                        {comparisonValues.Basic[idx]}
                      </td>
                      <td className="p-6 text-center bg-orange-500/5 text-orange-400 font-medium">
                        {comparisonValues.Pro[idx]}
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {comparisonValues.Elite[idx]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Bars Animation for Membership Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Class Variety", value: 85 },
              { label: "Equipment Quality", value: 95 },
              { label: "Member Satisfaction", value: 98 },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-orange-500 font-bold">{item.value}%</span>
                </div>
                <Progress.Root className="relative overflow-hidden bg-gray-800 rounded-full h-3">
                  <Progress.Indicator
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.value}%` }}
                  />
                </Progress.Root>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my membership anytime?",
                a: "Yes! All our plans are month-to-month with no long-term contracts. You can cancel anytime.",
              },
              {
                q: "Do you offer student or senior discounts?",
                a: "Yes! We offer 15% off for students with valid ID and 20% off for seniors 65+.",
              },
              {
                q: "What's included in the free trial?",
                a: "Your free trial includes full access to all gym facilities, group classes, and one complimentary personal training session.",
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Absolutely! You can change your membership tier at any time and the changes will take effect immediately.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
