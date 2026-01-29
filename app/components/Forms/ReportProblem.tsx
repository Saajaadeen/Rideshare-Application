export default function ReportProblem() {
  return (
    <a
      href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=cNEikIxyLku9z82rvvDH-ZCZaielw9NOvk93EFe11qlUQktFMEpGRFlMUUlZTDdLTzJMTFAwWFQ1NC4u"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
      aria-label="Report a bug"
    >
      {/* Bug Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      
      {/* Text - hidden on mobile, shown on desktop */}
      <span className="hidden md:inline font-semibold">Report a Problem</span>
    </a>
  );
}