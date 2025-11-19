const LocationSelect = ({
  label,
  value,
  onChange,
  options = [],
  excludeId,
  icon: Icon,
  name,
}: any) => {

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
          <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          </div>
        </>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100`}
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {options
            .filter((opt: any) => opt?.id !== excludeId)
            .map((opt: any) => (
              <option key={opt?.id} value={opt?.id}>
                {opt?.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelect;
