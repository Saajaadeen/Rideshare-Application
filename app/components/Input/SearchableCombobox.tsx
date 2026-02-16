import { useState, useRef, useEffect, type FC, type SVGProps } from "react";

interface Option {
  id: string;
  name: string;
  buildingNumber: number;
}

interface SearchableComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  excludeId?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  placeholder?: string;
}

export default function SearchableCombobox({
  label,
  name,
  value,
  onChange,
  options,
  excludeId = "",
  icon: Icon,
  placeholder,
}: SearchableComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display text when value changes externally (e.g. form reset)
  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value);
      setQuery(match?.name ?? "");
    } else {
      setQuery("");
    }
  }, [value, options]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // Restore display text if we have a selection
        if (value) {
          const match = options.find((o) => o.id === value);
          setQuery(match?.name ?? "");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, options]);

  const filtered = options
    .filter((o) => o.id !== excludeId)
    .filter((o) => {
      const q = query.toLowerCase();
      return o.name.toLowerCase().includes(q) || String(o.buildingNumber).includes(q);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleSelect(option: Option) {
    onChange(option.id);
    setQuery(option.name);
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder ?? `Search ${label.toLowerCase()}...`}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (value) onChange("");
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full text-black ${Icon ? "pl-11" : "pl-4"} pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-100`}
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${isOpen ? 'rotate-180': 'rotate-0'}  text-gray-400`} onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {filtered.map((option: Option) => (
            <li
              key={option.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
              className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-700 text-sm"
            >
              {option.name} <div className="inline-flex text-gray-400">{option.buildingNumber && `- Building #${option.buildingNumber}`}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
