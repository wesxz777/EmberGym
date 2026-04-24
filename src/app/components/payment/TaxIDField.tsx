interface TaxIDFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaxIDField({ value, onChange }: TaxIDFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Tax ID/TIN (Optional)
      </label>
      <input
        type="text"
        placeholder="XX-XXX-XXX-XXXXX"
        value={value}
        onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onChange(value);
            }}
            maxLength={13} 
            inputMode="numeric"
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />
      <p className="text-xs text-gray-500 mt-1">
        If you have a business tax ID/TIN, please enter it for tax purposes
      </p>
    </div>
  );
}
