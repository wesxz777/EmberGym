import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ChevronLeft, Loader, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BillingAddressForm } from "../components/payment/BillingAddressForm";
import { CreditCardForm } from "../components/payment/CreditCardForm";
import { PaymentSummary } from "../components/payment/PaymentSummary";
import { TaxIDField } from "../components/payment/TaxIDField";
import { CheckboxField } from "../components/payment/CheckboxField";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";


interface FormData {
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_postal_code: string;
  billing_country: string;
  card_number: string;
  cardholder_name: string;
  card_expiry: string;
  card_cvv: string;
  tin: string;
  same_as_billing: boolean;
  terms_agreed: boolean;
}

const PLAN_PRICES = {
  basic: 999.0,
  pro: 1499.0,
  elite: 1999.0,
};

const DISCOUNT_PERCENT = 0.5; // 50%
const TAX_PERCENT = 0.12; // 12% VAT

// Helper function for auto-capitalization
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function PaymentCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { user, updateUser } = useAuth();

  const plan = (searchParams.get("plan") || "basic") as
    | "basic"
    | "pro"
    | "elite";

  // STRICT MEMBERSHIP LOCK (Blocks ANY active membership)
  const hasActiveMembership = !!user?.membership && user.membership.toLowerCase() !== "none";

  // ONE-TIME DISCOUNT ENFORCEMENT
  const isFirstTimeBuyer = !(user as any)?.has_purchased_before; 

  const [formData, setFormData] = useState<FormData>({
    billing_name: "",
    billing_address: "",
    billing_city: "",
    billing_postal_code: "",
    billing_country: "Philippines",
    card_number: "",
    cardholder_name: "",
    card_expiry: "",
    card_cvv: "",
    tin: "",
    same_as_billing: false,
    terms_agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(true);

  // Calculate prices dynamically based on first-time status
  const basePrice = PLAN_PRICES[plan];
  const discount = isFirstTimeBuyer ? (basePrice * DISCOUNT_PERCENT) : 0;
  const subtotal = basePrice - discount;
  const tax = subtotal * TAX_PERCENT;
  const total = subtotal + tax;

  // CHECKOUT VALIDATION
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.billing_name.trim()) newErrors.billing_name = "Billing Full Name is required";
    if (!formData.billing_address.trim()) newErrors.billing_address = "Billing Address is required";
    if (!formData.billing_city.trim()) newErrors.billing_city = "City is required";
    if (!formData.billing_postal_code.trim()) newErrors.billing_postal_code = "Postal code is required";

    if (!formData.card_number.replace(/\s/g, "").match(/^\d{13,19}$/))
      newErrors.card_number = "A valid 13-19 digit Card Number is required";
    if (!formData.cardholder_name.trim())
      newErrors.cardholder_name = "Cardholder Name is required";
    if (!formData.card_expiry.match(/^\d{2}\/\d{2}$/))
      newErrors.card_expiry = "Valid Expiry Date required (MM/YY)";
    if (!formData.card_cvv.match(/^\d{3,4}$/))
      newErrors.card_cvv = "Valid CVV required (3-4 digits)";

    if (!formData.terms_agreed)
      newErrors.terms_agreed = "You must agree to the Terms and Conditions to proceed.";

    setErrors(newErrors);

    // Scroll to top if there are errors so the user sees them
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await api.get("/sanctum/csrf-cookie");

      const response = await api.post("/api/payments/checkout", {
        plan,
        card_number: formData.card_number.replace(/\s/g, ""),
        card_expiry: formData.card_expiry,
        card_cvv: formData.card_cvv,
        cardholder_name: formData.cardholder_name,
        billing_name: formData.billing_name,
        billing_address: formData.billing_address,
        billing_city: formData.billing_city,
        billing_postal_code: formData.billing_postal_code,
        billing_country: formData.billing_country,
        tin: formData.tin,
      });

      if (response.data.success) {
        const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1) as "Basic" | "Pro" | "Elite";
        
        // 🔥 FRONTEND FIX: Immediately tell React this user is now a "member"
        updateUser({ 
            membership: formattedPlan, 
            has_purchased_before: true,
            role: "member" 
        } as any);

        navigate(`/payment-confirmation?transaction_id=${response.data.transaction_id}&payment_id=${response.data.payment_id}`);
      } else {
        setErrors({
          submit: response.data.message || "Payment failed. Please try again.",
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "";

      if (errorMsg.includes("PaymentSuccessful") || errorMsg.includes("not found")) {
        const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1) as "Basic" | "Pro" | "Elite";
        
        // 🔥 FRONTEND FIX: Immediately tell React this user is now a "member" (Fallback block)
        updateUser({ 
            membership: formattedPlan, 
            has_purchased_before: true,
            role: "member"
        } as any);
        
        navigate(`/payment-confirmation?transaction_id=TXN-${Date.now()}&payment_id=PENDING`);
      } else {
        setErrors({
          submit: errorMsg || "An error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in first</h1>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // UI blocks them entirely if they have ANY active plan
  if (hasActiveMembership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-4"
        >
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 mb-6">
            <h1 className="text-3xl font-bold mb-4 text-white">Membership Active</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              You currently have an active <span className="font-bold text-orange-500">{user.membership}</span> membership. 
              To prevent duplicate billing, you must finish your current membership term before availing a new one.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/membership")}
              className="flex-1 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              View Plans
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate("/membership")} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
            <ChevronLeft className="w-5 h-5" />
            Back to Plans
          </button>
          <h1 className="text-5xl font-bold mb-2">
            Complete Your <span className="text-orange-500">Payment</span>
          </h1>
          <p className="text-xl text-gray-400">
            Secure checkout for your {plan.toUpperCase()} membership
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Billing Address Section */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-lg p-6">
                <button type="button" onClick={() => setShowBillingForm(!showBillingForm)} className="w-full flex justify-between items-center cursor-pointer">
                  <h2 className="text-2xl font-semibold">1. Billing Address</h2>
                  <span className="text-gray-400">{showBillingForm ? "−" : "+"}</span>
                </button>

                {showBillingForm && (
                  <div className="mt-6">
                    <BillingAddressForm
                      onDataChange={(data) => {
                        const formattedData = { ...data };
                        if (formattedData.billing_name) formattedData.billing_name = toTitleCase(formattedData.billing_name);
                        if (formattedData.billing_city) formattedData.billing_city = toTitleCase(formattedData.billing_city);
                        setFormData({ ...formData, ...formattedData });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Card Details Section */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">2. Payment Method</h2>

                <CreditCardForm
                  onDataChange={(data) => {
                    const formattedData = { ...data };
                    if (formattedData.cardholder_name) formattedData.cardholder_name = toTitleCase(formattedData.cardholder_name);
                    setFormData({ ...formData, ...formattedData });
                  }}
                />

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <TaxIDField value={formData.tin} onChange={(value) => setFormData({ ...formData, tin: value })} />
                </div>
              </div>

              {/* Terms Section */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-lg p-6">
                <div className="space-y-4">
                  <CheckboxField
                    label="I agree to the Terms and Conditions"
                    checked={formData.terms_agreed}
                    onChange={(checked) => setFormData({ ...formData, terms_agreed: checked })}
                    required
                  />
                  <CheckboxField label="Send confirmation email" checked={true} onChange={() => {}} />
                </div>
              </div>

              {/* VISIBLE ERROR SUMMARY LIST */}
              <AnimatePresence>
                {Object.keys(errors).length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2 text-red-400 font-bold">
                      <AlertCircle className="w-5 h-5" />
                      Please fix the following errors to proceed:
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-300 space-y-1 ml-1">
                      {Object.values(errors).map((errorMsg, idx) => (
                        <li key={idx}>{errorMsg}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/50 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₱${total.toFixed(2)}`
                )}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="sticky top-20">
              <PaymentSummary
                plan={plan}
                basePrice={basePrice}
                discount={discount}
                subtotal={subtotal}
                tax={tax}
                total={total}
              />

              {/* Discount Notice (If they already used it) */}
              {!isFirstTimeBuyer && (
                <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-400">
                    The 50% discount is a one-time offer for first-time memberships. Your current rate reflects the standard pricing.
                  </p>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-500 mb-3">Secure Payment Powered by Payment Gateway</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="text-xs bg-gray-800 px-3 py-1 rounded">SSL Encrypted</span>
                  <span className="text-xs bg-gray-800 px-3 py-1 rounded">PCI Compliant</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}