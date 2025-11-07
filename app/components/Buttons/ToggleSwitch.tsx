interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  name?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label = "",
  name,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {name && <input type="hidden" name={name} value={checked ? "true" : "false"} />}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
    </div>
  );
}
