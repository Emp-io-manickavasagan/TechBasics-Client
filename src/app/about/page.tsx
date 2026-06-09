import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hey, I'm Manickavasagan — a CS student, builder, and the person behind TechBasics. This is the story of why this blog exists.",
  alternates: {
    canonical: "https://www.techbasics.online/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
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
            <Link href="/about" className="text-indigo-600 font-semibold">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl select-none shadow-lg">
            M
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              CS Student · Builder · Writer
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Hey, I&apos;m Manickavasagan 👋
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              A Computer Science student. A builder. And someone who once launched a SaaS app that quietly failed.
              <br />
              <span className="text-slate-400 text-base italic">I know — not the most glamorous intro. But that failure is honestly the best thing that happened to me.</span>
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10">

        {/* The Story */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">The Story Behind TechBasics</h2>
          <p className="text-slate-600 leading-relaxed">
            Before I started this blog, I spent months building a productivity SaaS app from scratch. I was excited. I had ideas, I had energy, and I had absolutely no idea how hard it would be.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The app didn&apos;t survive. But I did — and I came out the other side knowing things I couldn&apos;t have learned in any classroom:
          </p>
          <ul className="space-y-2 text-slate-600 list-none pl-1">
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">→</span> How to think about real user problems</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">→</span> What &quot;building in public&quot; actually means</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">→</span> Why most ideas die before launch</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">→</span> And how much there still is to learn</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            That curiosity didn&apos;t go away. It turned into TechBasics.
          </p>
        </div>

        {/* Honest note */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">A Quick Honest Note</h2>
          <p className="text-slate-600 leading-relaxed">
            I&apos;m not an expert. I don&apos;t have all the answers.
          </p>
          <p className="text-slate-600 leading-relaxed">
            I&apos;m a student who&apos;s still figuring things out — making mistakes, Googling things I probably should already know, and learning in public without pretending otherwise.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you came here looking for a guru with 10 years of experience and a perfect track record, this isn&apos;t that place.
          </p>
          <p className="text-slate-600 leading-relaxed font-medium">
            But if you&apos;re also somewhere in the middle — not a complete beginner, not a seasoned pro, just someone genuinely trying to understand and build things — then we&apos;re in the same boat. And maybe that&apos;s exactly why this blog will feel useful to you.
          </p>
        </div>

        {/* What this blog is */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">What This Blog Is</h2>
          <p className="text-slate-600 leading-relaxed">
            TechBasics is where I write about everything I&apos;m learning as I go — no filters, no expert posturing. You&apos;ll find posts on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { emoji: "💻", label: "Tech", desc: "Tools, trends, and what's worth paying attention to" },
              { emoji: "🚀", label: "Startups", desc: "Honest takes on building, failing, and trying again" },
              { emoji: "🤖", label: "AI", desc: "What's actually useful vs. what's just hype" },
              { emoji: "🛠️", label: "Development", desc: "Things I pick up while coding and building" },
              { emoji: "⚡", label: "Productivity", desc: "Systems that actually work for students and builders" },
              { emoji: "📊", label: "Business", desc: "The basics nobody teaches you in college" },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            If you&apos;re a student, a builder, or just someone curious about the tech world — this blog is for you.
          </p>
        </div>

        {/* Why TechBasics */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Why &quot;TechBasics&quot;?</h2>
          <p className="text-slate-600 leading-relaxed">
            Because the fundamentals matter more than the flashy stuff.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Everyone&apos;s chasing the next framework, the next AI model, the next big thing. I&apos;d rather understand <em>why</em> things work the way they do — and share that clearly, without the jargon.
          </p>
        </div>

        {/* What I'm doing now */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">What I&apos;m Doing Now</h2>
          <p className="text-slate-600 leading-relaxed">
            Right now I&apos;m studying CS, building new projects, and learning something new almost every week. This blog is my way of making those lessons useful for someone else too.
          </p>
        </div>

        {/* Connect */}
        <div className="bg-slate-900 rounded-3xl p-8 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-white">Let&apos;s Connect</h2>
          <p className="text-slate-400 leading-relaxed">
            Got thoughts, feedback, or just want to say hi?
          </p>
          <a
            href="mailto:emp.ccreator@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            📩 emp.ccreator@gmail.com
          </a>
          <p className="text-slate-500 text-sm pt-2">
            Thanks for being here. Go read something.
            <br />
            <span className="text-slate-400 font-medium">— Manickavasagan</span>
          </p>
        </div>

      </main>

      {/* Footer */}
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
            <Link href="/about" className="text-white hover:text-white transition-colors">About</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
