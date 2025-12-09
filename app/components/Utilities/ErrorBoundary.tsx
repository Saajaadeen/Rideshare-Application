import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../routes/+types/entry";
import { useState } from "react";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const [copied, setCopied] = useState(false);
  let message = "Something Went Wrong";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let statusCode: number | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    message = error.status === 404 ? "Page Not Found" : "Error";
    details = error.data || error.statusText || details;
  } 
  else if (error instanceof Error) {
    message = error.name || "Error";
    details = error.message;
    stack = error.stack;
  } 
  else if (error && typeof error === 'object') {
    if ('message' in error) {
      details = String(error.message);
    }
    if ('stack' in error) {
      stack = String(error.stack);
    }
    if ('status' in error) {
      statusCode = Number(error.status);
    }
  } 
  else if (error) {
    details = String(error);
  }

  const copyError = () => {
    const errorText = `Error: ${message}\nDetails: ${details}${
      stack ? `\n\nStack Trace:\n${stack}` : ""
    }${statusCode ? `\nStatus Code: ${statusCode}` : ""}`;
    
    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-12 text-center">
            {statusCode && (
              <div className="text-white/90 text-8xl font-bold mb-4">
                {statusCode}
              </div>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">{message}</h1>
            <div className="w-20 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>

          <div className="px-8 py-8">
            <div className="flex items-start space-x-3 mb-6">
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  What happened?
                </h2>
                <p className="text-gray-600 leading-relaxed">{details}</p>
              </div>
            </div>

            {stack && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Technical Details
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed border border-gray-700">
                  <code>{stack}</code>
                </pre>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyError}
                className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Error
                  </>
                )}
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Go Back
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          Need help? Contact support or try refreshing the page.
        </div>
      </div>
    </main>
  );
}