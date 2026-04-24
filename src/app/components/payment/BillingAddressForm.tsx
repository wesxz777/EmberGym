import { useState } from "react";

interface BillingAddressFormProps {
  onDataChange: (data: any) => void;
}

export function BillingAddressForm({ onDataChange }: BillingAddressFormProps) {
  const [data, setData] = useState({
    billing_name: "",
    billing_address: "",
    billing_city: "",
    billing_postal_code: "",
    billing_country: "Philippines",
  });

  const handleChange = (field: string, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Billing Address</h3>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          placeholder="Juan A Dela Cruz"
          value={data.billing_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            handleChange("billing_name", value);
          }}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Address *
        </label>
        <input
          type="text"
          placeholder="123 Main St"
          value={data.billing_address}
          onChange={(e) => handleChange("billing_address", e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City *
          </label>
          <input
            type="text"
            placeholder="Manila"
            value={data.billing_city}
            onChange={(e) => handleChange("billing_city", e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            placeholder="1000"
            value={data.billing_postal_code}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChange("billing_postal_code", value);
            }}
            maxLength={5} 
            inputMode="numeric"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Country *
        </label>
        <select
          value={data.billing_country}
          onChange={(e) => handleChange("billing_country", e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          required
        >
          <option value="Philippines">Philippines</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
        </select>
      </div>
    </div>
  );
}
