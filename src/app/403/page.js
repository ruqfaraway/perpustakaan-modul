import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <p className="mt-4 text-lg font-semibold text-gray-800">
          Akses Ditolak
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-md border px-5 py-2 text-gray-700 hover:bg-gray-100"
          >
            Beranda
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Login Ulang
          </Link>
        </div>
      </div>
    </div>
  );
}
