interface PaymentSummaryProps {
  plan: string;
  basePrice: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export function PaymentSummary({
  plan,
  basePrice,
  discount,
  subtotal,
  tax,
  total,
}: PaymentSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 border-b border-gray-700 pb-4 mb-4">
        <div>
          <p className="text-gray-400">Plan</p>
          <p className="text-lg font-semibold capitalize">{plan}</p>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Base Price</span>
          <span className="text-white">₱{basePrice.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>50% Discount</span>
            <span>-₱{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold border-t border-gray-700 pt-3">
          <span>Subtotal</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Tax (12% VAT)</span>
          <span className="text-white">₱{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
        <span className="text-lg font-semibold">Total Amount</span>
        <span className="text-2xl font-bold text-orange-500">₱{total.toFixed(2)}</span>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Payment valid for 1 month from the date of purchase
      </p>
    </div>
  );
}
