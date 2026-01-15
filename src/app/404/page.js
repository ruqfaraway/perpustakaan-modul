import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          Halaman yang kamu cari tidak ditemukan.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Bisa jadi URL salah atau halaman sudah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
