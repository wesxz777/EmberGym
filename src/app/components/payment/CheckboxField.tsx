interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export function CheckboxField({
  label,
  checked,
  onChange,
  required = false,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-700 text-orange-500 bg-gray-800 focus:ring-orange-500 cursor-pointer"
        required={required}
      />
      <label className="text-gray-300 cursor-pointer">{label}</label>
    </div>
  );
}
