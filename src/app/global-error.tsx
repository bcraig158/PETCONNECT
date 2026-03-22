'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-neutral-600 mb-6">
              An unexpected error occurred. We apologize for the inconvenience.
            </p>
            {error.digest && (
              <p className="text-xs text-neutral-400 mb-4 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="rounded-lg bg-black px-5 py-2.5 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Try Again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
