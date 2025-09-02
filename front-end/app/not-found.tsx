"use client";

import { useRouter } from "next/navigation";
import { AlertTriangleIcon, HomeIcon } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">404 – Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Uh oh! This page didn’t wake up today. Or maybe it never existed.
          &#128373;
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HomeIcon className="h-4 w-4" />
          Take me home
        </button>
      </div>
    </div>
  );
}
