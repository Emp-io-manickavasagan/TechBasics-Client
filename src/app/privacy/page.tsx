import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.svg" alt="TechBasics Logo" width={40} height={40} className="object-contain rounded-lg" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">TechBasics</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Knowledge Hub</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/privacy" className="text-indigo-600 font-semibold">Privacy Policy</Link>
          </nav>
        </div>
      </header>

      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            Privacy made simple.
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            TechBasics is a minimalist, read-only blog. We keep privacy simple and do not collect personal data from visitors.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Last Updated</span>
            <p className="text-sm text-slate-600 font-medium">May 2026</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">TechBasics Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              TechBasics is a <strong>read-only blog</strong>. We don't collect personal information from visitors.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">What We Don't Do</h3>
            <ul className="space-y-2 text-slate-600 list-none">
              <li>❌ No login required</li>
              <li>❌ No email collection</li>
              <li>❌ No comments section</li>
              <li>❌ No contact forms</li>
              <li>❌ No personal data collection</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Website Analytics (Optional)</h3>
            <p className="text-slate-600 leading-relaxed">
              We may use <strong>Google Analytics</strong> to understand:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>How many people visit our site</li>
              <li>Which articles are popular</li>
              <li>General visitor location (country level only)</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              You can:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Opt out by disabling cookies in your browser</li>
              <li>Use a privacy extension like uBlock Origin</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                Google Analytics Privacy Policy
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Cookies</h3>
            <p className="text-slate-600 leading-relaxed">
              We may use cookies for:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Page theme preference (light/dark mode)</li>
              <li>Basic website functionality</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              You can delete cookies anytime in your browser settings.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Third-Party Links</h3>
            <p className="text-slate-600 leading-relaxed">
              Our blog may link to external websites. We're not responsible for their privacy practices.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
            <p className="text-slate-600 leading-relaxed">
              For privacy questions:
              <br />
              <strong>Email:</strong> <a href="mailto:emp.ccreator@gmail.com" className="text-indigo-600 hover:text-indigo-800 transition-colors">emp.ccreator@gmail.com</a>
            </p>
          </div>

          <p className="text-sm text-slate-500 italic">
            That's it. We keep it simple because we don't collect data.
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-white font-bold tracking-tight text-lg">TechBasics</span>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} TechBasics.online. All rights reserved.</p>
            <p className="text-xs text-slate-500">
              Email: <a href="mailto:emp.ccreator@gmail.com" className="text-slate-300 hover:text-white transition-colors">emp.ccreator@gmail.com</a>
            </p>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/privacy" className="text-white hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
