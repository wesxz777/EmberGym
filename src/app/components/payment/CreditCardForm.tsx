import { useState } from "react";
import { CreditCard } from "lucide-react";

interface CreditCardFormProps {
  onDataChange: (data: any) => void;
}

export function CreditCardForm({ onDataChange }: CreditCardFormProps) {
  const [data, setData] = useState({
    card_number: "",
    cardholder_name: "",
    card_expiry: "",
    card_cvv: "",
  });

  const handleChange = (field: string, value: string) => {
    let formatted = value;

    if (field === "card_number") {
      formatted = value.replace(/\s/g, "").slice(0, 19);
      formatted = formatted.replace(/(\d{4})/g, "$1 ").trim();
    } else if (field === "card_expiry") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
    } else if (field === "card_cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    const updated = { ...data, [field]: formatted };
    setData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Credit Card Details
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Number *
        </label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={data.card_number}
          onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChange("card_number", value);
            }}
          maxLength={16} 
          inputMode="numeric"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cardholder Name *
        </label>
        <input
          type="text"
          placeholder="Juan A Dela Cruz"
          value={data.cardholder_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            handleChange("cardholder_name", value);
          }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expiry Date (MM/YY) *
          </label>
          <input
            type="text"
            placeholder="12/25"
            value={data.card_expiry}
            onChange={(e) => handleChange("card_expiry", e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CVV *
          </label>
          <input
            type="text"
            placeholder="123"
            value={data.card_cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChange("card_cvv", value);
            }}
            maxLength={3} 
            inputMode="numeric"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
