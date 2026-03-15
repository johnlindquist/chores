import Link from "next/link";

export default function BenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Daily Scripture</h1>
          <p className="text-gray-500 mt-2">
            Ben&apos;s quote has been replaced. TRMNL now shows a daily Book of
            Mormon scripture in the footer.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <p className="text-gray-700">
            This page is intentionally read-only so it no longer advertises an
            edit flow that does not affect TRMNL.
          </p>
          <p className="text-sm text-gray-500">
            If you want an admin surface later, add a dedicated scripture
            preview page instead of reusing the old quote editor.
          </p>
          <Link
            href="/"
            className="block w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 transition-colors text-center"
          >
            Back to app
          </Link>
        </div>
      </div>
    </div>
  );
}
