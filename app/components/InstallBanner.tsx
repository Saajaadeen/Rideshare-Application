import { useInstallPrompt } from "~/hooks/useInstallPrompt";

export default function InstallBanner() {
  const { platform, showBanner, promptInstall, dismiss } = useInstallPrompt();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="max-w-lg mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 border border-white/10">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          {platform === "ios" ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Install Base Bound</p>
          {platform === "ios" ? (
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
              Tap the{" "}
              <span className="inline-flex items-center gap-1 text-white font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </span>{" "}
              button then <span className="text-white font-medium">Add to Home Screen</span> for the best experience and push notifications.
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">
              Install for the best experience — instant access and push notifications.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {platform === "android" && (
            <button
              type="button"
              onClick={promptInstall}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
