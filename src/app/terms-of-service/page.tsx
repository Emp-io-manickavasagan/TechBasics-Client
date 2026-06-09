import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for TechBasics — a personal technology blog at www.techbasics.online.",
  alternates: {
    canonical: "https://www.techbasics.online/terms-of-service",
  },
};

export default function TermsOfServicePage() {
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
            <Link href="/terms-of-service" className="text-indigo-600 font-semibold">Terms of Service</Link>
          </nav>
        </div>
      </header>

      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            Please read carefully.
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Welcome to{" "}
            <a href="https://www.techbasics.online" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              www.techbasics.online
            </a>. By accessing or using this website, you agree to the following Terms of Service.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Last Updated</span>
            <p className="text-sm text-slate-600 font-medium">June 9, 2026</p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By visiting or browsing this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use of this site immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. About This Website</h2>
            <p className="text-slate-600 leading-relaxed">
              <a href="https://www.techbasics.online" className="text-indigo-600 hover:text-indigo-800 transition-colors">www.techbasics.online</a> is a personal blog that publishes content related to technology, startups, software development, artificial intelligence, productivity, and business. The site is <strong>read-only</strong> — it does not require account creation, registration, or login of any kind.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              All content published on this blog — including articles, text, graphics, logos, and other materials — is owned by the blog owner and is protected under applicable copyright laws.
            </p>
            <p className="text-slate-600 font-medium">You are welcome to:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Read and share links to any published content.</li>
              <li>Quote brief excerpts with clear attribution and a link back to the original post.</li>
            </ul>
            <p className="text-slate-600 font-medium">You may not:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Reproduce, republish, or redistribute full articles without written permission.</li>
              <li>Use content for commercial purposes without prior consent.</li>
              <li>Scrape or systematically copy content from this site.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Data Collection &amp; Google Analytics</h2>
            <p className="text-slate-600 leading-relaxed">
              This site does not operate user accounts, collect personal information through forms, or process any payment data.
            </p>
            <p className="text-slate-600 leading-relaxed">
              However, this site uses <strong>Google Analytics</strong>, a web analytics service provided by Google LLC. Google Analytics collects certain information automatically when you visit this site, including:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Pages visited and time spent on each page.</li>
              <li>General geographic region (country/city level).</li>
              <li>Browser type, device type, and operating system.</li>
              <li>Referring website or source.</li>
              <li>Anonymous usage patterns and interactions.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              This data is collected via cookies placed by Google Analytics and is used solely to understand how visitors use this blog, so that content and user experience can be improved.
            </p>
            <p className="text-slate-600 font-medium">Your choices regarding analytics tracking:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>
                You may opt out by installing the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                  Google Analytics Opt-Out Browser Add-On
                </a>.
              </li>
              <li>You may also disable cookies through your browser settings, which will limit or prevent Google Analytics tracking.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              For more on how Google processes this data, please refer to{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                Google&apos;s Privacy &amp; Terms
              </a>.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              The only cookies used on this site are those placed by Google Analytics as described in Section 4. No other first-party cookies, tracking pixels, or session data are stored by this site.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Third-Party Links</h2>
            <p className="text-slate-600 leading-relaxed">
              This blog may contain links to external websites, tools, products, or resources for informational purposes. These links do not constitute an endorsement of those sites or their content.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We have no control over the content, privacy policies, or practices of any third-party sites and accept no responsibility for them. We encourage you to review the privacy policies of any external site you visit.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Disclaimer of Warranties</h2>
            <p className="text-slate-600 leading-relaxed">
              All content on this blog is provided &quot;as is&quot; for general informational and educational purposes only. While we strive for accuracy, we make no warranties or representations — express or implied — regarding:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>The accuracy, completeness, or reliability of any content.</li>
              <li>The suitability of any information for a particular purpose.</li>
              <li>The availability or uninterrupted access to the site.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              Nothing on this blog constitutes professional legal, financial, business, or technical advice. Always consult a qualified professional before making decisions based on information you read here.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              To the fullest extent permitted by applicable law, the blog owner shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
            </p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Your use of or reliance on any content on this site.</li>
              <li>Any errors, omissions, or inaccuracies in the content.</li>
              <li>Unauthorized access to or alteration of your transmissions or data.</li>
              <li>Any other matter relating to this site.</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">9. Changes to These Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to update or modify these Terms of Service at any time without prior notice. The &quot;Last Updated&quot; date at the top of this page will reflect any changes. Continued use of the site after changes are posted constitutes your acceptance of the updated terms.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">10. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the blog owner resides, without regard to its conflict of law provisions.
            </p>
          </div>

          {/* Section 11 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">11. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions or concerns about these Terms of Service, you can reach us at:
              <br />
              <a href="mailto:emp.ccreator@gmail.com" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                emp.ccreator@gmail.com
              </a>
            </p>
          </div>

          <p className="text-sm text-slate-500 italic border-t border-slate-100 pt-6">
            By continuing to use this site, you agree to these Terms of Service.
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-white font-bold tracking-tight text-lg">TechBasics</span>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} TechBasics.online. All rights reserved.</p>
            <p className="text-xs text-slate-500">
              Email:{" "}
              <a href="mailto:emp.ccreator@gmail.com" className="text-slate-300 hover:text-white transition-colors">
                emp.ccreator@gmail.com
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-white hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
