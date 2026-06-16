"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Parse the mostPeopleAsked markdown string into Q&A pairs.
 * Lines starting with "# " are questions; all lines until the next
 * "# " heading form the answer (rendered as markdown).
 */
function parseFaq(raw: string): FaqItem[] {
  const items: FaqItem[] = [];
  const lines = raw.split("\n");
  let currentQ: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (currentQ) {
      items.push({ question: currentQ, answer: answerLines.join("\n").trim() });
    }
  };

  for (const line of lines) {
    if (/^#\s+/.test(line)) {
      flush();
      currentQ = line.replace(/^#\s+/, "").trim();
      answerLines = [];
    } else {
      if (currentQ !== null) answerLines.push(line);
    }
  }
  flush();
  return items;
}

interface Props {
  content: string;
}

export default function FaqAccordion({ content }: Props) {
  const items = parseFaq(content);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full mt-10 border-t border-slate-200 pt-10">
      {/* Section Header */}
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
        Most People Asked
      </h3>

      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-indigo-200 shadow-sm shadow-indigo-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              {/* Question / Toggle Button */}
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
                  isOpen ? "bg-indigo-50/60" : "bg-white hover:bg-slate-50/70"
                }`}
              >
                <span
                  className={`text-sm font-semibold leading-snug ${
                    isOpen ? "text-indigo-700" : "text-slate-800"
                  }`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-indigo-500" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Answer — animated expand */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 prose prose-sm prose-slate max-w-none
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm
                    prose-a:text-indigo-600 prose-a:font-semibold
                    prose-code:bg-indigo-50 prose-code:text-indigo-700 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-code:font-mono
                    prose-strong:text-slate-800
                    prose-ul:text-slate-600 prose-ol:text-slate-600
                    prose-li:text-sm prose-li:leading-relaxed
                    prose-blockquote:border-indigo-400 prose-blockquote:text-slate-500
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
