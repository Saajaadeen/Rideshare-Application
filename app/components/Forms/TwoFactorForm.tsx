import { useState, useRef } from "react";
import { Link } from "react-router";

export default function TwoFactorForm({ userPhoneNumber, error }: any) {
  const [code, setCode] = useState(Array(8).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]?$/.test(value))
      return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 7) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-[450px]">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-500 text-sm">
            Enter the code sent to (***) ***-{userPhoneNumber}
          </p>
        </div>

        <form method="POST" action="/verify">
          <input type="hidden" name="intent" value="verify" />
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="flex justify-between mb-6">
            {code.map((char, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                name={`code-${index}`}
                value={char}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                required
                className="w-10 h-12 text-black text-center border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-blue-500 focus:bg-white bg-gray-50 outline-none transition-all uppercase"
              />
            ))}
          </div>

          <input type="hidden" name="code" value={code.join("")} />

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
          >
            Verify Code
          </button>
        </form>

        <form method="POST" action="/verify">
          <input type="hidden" name="intent" value="resend" />
          <p className="text-sm text-center text-gray-600 mt-6">
            Didn’t receive a code?{" "}
            <Link
              to="/resend"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Resend
            </Link>
          </p>
        </form>
      </div>

      <div className="absolute bottom-6 text-center text-sm text-gray-500">
        <p>Secured Shared Rides</p>
      </div>
    </div>
  );
}
