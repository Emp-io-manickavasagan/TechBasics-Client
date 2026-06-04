import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
        <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
        <p className="text-xl font-semibold text-slate-700 mt-4">Page not found</p>
        <p className="text-slate-500 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700 transition-colors">Go home</Link>
          <Link href="/" className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Search site</Link>
        </div>
      </div>
    </div>
  );
}
