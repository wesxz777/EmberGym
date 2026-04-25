import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, Download, Home, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";


interface PaymentData {
  id: number;
  plan: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  transaction_id: string;
  paid_at: string;
}

export function PaymentConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();

  const transactionId = searchParams.get("transaction_id");
  const paymentId = searchParams.get("payment_id");

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user || !paymentId || hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const fetchPaymentStatus = async () => {
      // --- PRESENTATION MODE BYPASS ---
      if (paymentId === "PENDING") {
        const planName = user.membership ? user.membership.toLowerCase() : "basic";
        
        let basePrice = 999.0;
        if (planName === "pro") basePrice = 1499.0;
        if (planName === "elite") basePrice = 1999.0;

        const subtotal = basePrice * 0.5;
        const tax = subtotal * 0.12;
        const total = subtotal + tax;

        setTimeout(() => {
          setPayment({
            id: Math.floor(Math.random() * 10000),
            plan: planName,
            amount: Math.round(basePrice * 100), 
            tax_amount: Math.round(tax * 100),
            total_amount: Math.round(total * 100),
            status: "completed",
            transaction_id: transactionId || `TXN-${Date.now()}`,
            paid_at: new Date().toISOString(),
          });
          setIsLoading(false);
          
          window.dispatchEvent(new Event("refresh-notifications")); 
          
        }, 800); 
        return;
      }
      // --------------------------------

      try {
        const response = await api.get(`/api/payments/status/${paymentId}`);
        
        if (response.data.success) {
          setPayment(response.data.payment);

          const planName =
            response.data.payment.plan.charAt(0).toUpperCase() +
            response.data.payment.plan.slice(1);
            
          updateUser({
            membership: planName as "Basic" | "Pro" | "Elite",
          });
          
          window.dispatchEvent(new Event("refresh-notifications"));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch payment status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId, user, updateUser, transactionId]);

  // --- FETCH OFFICIAL PDF FROM LARAVEL ---
  const handleDownloadReceipt = async () => {
    if (!payment) return;
    
    setIsDownloading(true);
    
    try {
      // Request the PDF blob from Laravel
      const response = await api.get(`/api/payments/${payment.id}/receipt`, {
        responseType: 'blob', // This is crucial for handling files!
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      // Create a temporary invisible link to trigger the browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EmberGym_Receipt_${payment.transaction_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Something went wrong while downloading the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/membership")}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
            >
              Back to Plans
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  const amount = (payment.total_amount / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-400" />
          </motion.div>

          <h1 className="text-5xl font-bold mb-4">
            Payment <span className="text-green-400">Successful!</span>
          </h1>
          <p className="text-xl text-gray-400">
            Your membership has been activated
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-lg p-8 mb-8"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-2xl font-semibold mb-2">Your Receipt</h2>
              <p className="text-gray-400">
                A confirmation email has been sent to {user.email}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 mb-2">Transaction ID</p>
                <p className="font-mono text-sm bg-gray-800 p-3 rounded">
                  {transactionId}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Payment Date</p>
                <p className="font-semibold">
                  {new Date(payment.paid_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-2">Plan</p>
                <p className="text-2xl font-bold text-orange-500 capitalize">
                  {payment.plan}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Status</p>
                <p className="text-lg font-semibold text-green-400 capitalize">
                  {payment.status}
                </p>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
              <p className="text-gray-300 font-semibold mb-4">Detailed Breakdown</p>
              
              <div className="space-y-3 mb-4 border-b border-orange-500/20 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Price</span>
                  <span className="text-white">₱{(payment.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>50% Discount</span>
                  <span>-₱{((payment.amount / 100) * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-orange-500/20 pt-3">
                  <span>Subtotal</span>
                  <span>₱{((payment.amount / 100) * 0.5).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (12% VAT)</span>
                  <span className="text-white">₱{(payment.tax_amount / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-orange-500/20 rounded p-4 border border-orange-500/30">
                <span className="text-lg font-semibold">Total Amount Paid</span>
                <span className="text-2xl font-bold text-orange-500">₱{amount}</span>
              </div>
            </div>

            {/* Membership Info */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <p className="text-gray-300 font-semibold mb-2">
                Membership Activated
              </p>
              <p className="text-sm text-gray-400">
                Your {payment.plan.toUpperCase()} membership is now active and
                valid for 1 month from today. You can access all gym facilities
                immediately.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              <button
                onClick={handleDownloadReceipt}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/membership")}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
              >
                View All Plans
              </button>
            </div>
          </div>
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}