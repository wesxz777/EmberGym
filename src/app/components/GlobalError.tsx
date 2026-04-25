import { useRouteError } from "react-router-dom";

export function GlobalError() {
  // Grab the error from React Router
  const error = useRouteError() as any;

  // Safely extract the message WITHOUT using the buggy .filter() method
  const errorMessage = error?.message || error?.statusText || JSON.stringify(error) || "Unknown error occurred";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-red-500 mb-4">🚨 App Crash Intercepted!</h1>
        <p className="text-gray-300 mb-6">
          We caught a fatal error before it could trigger the White Screen of Death. 
          Here is exactly what broke:
        </p>
        <div className="bg-black/80 p-4 rounded-lg text-left overflow-auto border border-red-500/20 max-h-64">
          <code className="text-red-400 font-mono text-sm whitespace-pre-wrap">
            {errorMessage}
          </code>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
        >
          Restart App
        </button>
      </div>
    </div>
  );
}