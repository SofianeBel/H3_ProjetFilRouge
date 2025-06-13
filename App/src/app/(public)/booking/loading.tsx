"use client";

// Ce composant est utilisé automatiquement par Next.js comme fallback
// pour la page /booking lorsqu'elle est rendue côté serveur ou lors du
// streaming. Il résout ainsi l'erreur "useSearchParams() should be wrapped
// in a suspense boundary".
export default function BookingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      {/* Petit indicateur de chargement */}
      <svg
        className="animate-spin h-8 w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="ml-4">Chargement du formulaire…</span>
    </div>
  );
} 