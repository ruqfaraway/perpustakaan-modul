import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-yellow-500">⚠️</h1>
        <p className="mt-4 text-lg font-semibold text-gray-800">
          Kamu Belum Login
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Silakan login untuk melanjutkan ke halaman ini.
        </p>

        <Link
          href="/login"
          className="inline-block mt-6 rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Login Sekarang
        </Link>
      </div>
    </div>
  );
}
