import { useState } from "react";
import { Link } from "react-router"; // use react-router-dom
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeOpenIcon } from "../Icons/EyeOpenIcon";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  carrier: string;
  password: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    carrier: "",
    password: "",
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? formatPhoneNumber(value) : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-[550px]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-t-3xl" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9 9 0 1118.88 6.195M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join Base Bound to start your secure rides
          </p>
        </div>

        {/* Form */}
        <form method="POST" action="/register" className="space-y-5">
          {[
            {
              label: "First Name",
              name: "firstName",
              type: "text",
              placeholder: "John",
            },
            {
              label: "Last Name",
              name: "lastName",
              type: "text",
              placeholder: "Doe",
            },
            {
              label: "Email Address",
              name: "email",
              type: "email",
              placeholder: "you@example.com",
            },
            {
              label: "Phone Number",
              name: "phoneNumber",
              type: "tel",
              placeholder: "(123) 456-7890",
              maxLength: 14,
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof FormData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                required
                className="w-full px-4 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeClosedIcon className="size-5" />
                ) : (
                  <EyeOpenIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>

      <div className="absolute bottom-6 text-center text-sm text-gray-500">
        <p>Secured Shared Rides</p>
      </div>
    </div>
  );
}
