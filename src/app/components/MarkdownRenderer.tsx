"use client";

import React from "react";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy code"}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200
        bg-slate-700/60 hover:bg-slate-600/80 text-slate-300 hover:text-white border border-slate-600/40
        hover:border-slate-500/60 select-none"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ─── Code Block ──────────────────────────────────────────────────────────────
function CodeBlock({
  language,
  code,
}: {
  language: string | null;
  code: string;
}) {
  const displayLang = language ?? "text";

  return (
    <div className="relative group my-5 sm:my-7 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg shadow-slate-900/20">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700/60">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        {/* Language label */}
        <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 select-none">
          {displayLang}
        </span>
        {/* Copy button */}
        <CopyCodeButton code={code} />
      </div>

      {/* Syntax-highlighted body */}
      {language ? (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1.5rem",
            background: "#0f1117",
            fontSize: "13px",
            lineHeight: "1.75",
            borderRadius: 0,
          }}
          showLineNumbers
          lineNumberStyle={{
            color: "#4a5568",
            minWidth: "2.5em",
            paddingRight: "1em",
            userSelect: "none",
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        // Plain fenced block (no language) — monospace, no line numbers
        <pre
          className="overflow-x-auto bg-[#0f1117] text-slate-200 p-5
            text-[12px] sm:text-[13px] font-mono leading-7 whitespace-pre m-0"
        >
          {code}
        </pre>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * Client component wrapper for ReactMarkdown rendering.
 * Extracted to keep the blog post page as a Server Component.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          // ── Headings ──────────────────────────────────────────────────────
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl font-bold text-slate-800 mt-8 mb-4"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-bold text-slate-800 mt-6 mb-3"
              {...props}
            />
          ),

          // ── Paragraph ─────────────────────────────────────────────────────
          // react-markdown can wrap fenced code blocks inside a <p>. A <div>
          // inside a <p> is invalid HTML and causes a hydration error. We
          // detect that case and render a <div> wrapper instead.
          p: ({ node, children, ...props }) => {
            const hasBlockChild = React.Children.toArray(children).some(
              (child) =>
                React.isValidElement(child) &&
                typeof child.type === "string" &&
                ["div", "pre", "figure", "ul", "ol", "table", "blockquote"].includes(
                  child.type
                )
            );

            if (hasBlockChild) {
              return (
                <div className="text-slate-600 leading-8 mb-6 text-[15px] sm:text-[16px]">
                  {children}
                </div>
              );
            }

            return (
              <p
                className="text-slate-600 leading-8 mb-6 text-[15px] sm:text-[16px]"
                {...props}
              >
                {children}
              </p>
            );
          },

          // ── Lists ─────────────────────────────────────────────────────────
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 mb-6 text-slate-600 space-y-2 text-[15px]"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 mb-6 text-slate-600 space-y-2 text-[15px]"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),

          // ── Blockquote ────────────────────────────────────────────────────
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-xl px-4 py-3 italic text-slate-500 my-6"
              {...props}
            />
          ),

          // ── Code (inline & fenced) ────────────────────────────────────────
          code: ({ node, inline, className, children, ...props }: any) => {
            // Inline code  (`backtick`)
            if (inline) {
              return (
                <code
                  className="bg-indigo-50 text-indigo-700 font-semibold px-1 sm:px-1.5 py-0.5 rounded text-[11px] sm:text-[13px] font-mono break-all"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Fenced code block — extract language (may be undefined)
            const langMatch = /language-(\w+)/.exec(className || "");
            const language = langMatch ? langMatch[1] : null;
            const code = String(children).replace(/\n$/, "");

            return <CodeBlock language={language} code={code} />;
          },

          // ── pre — suppress default wrapper so CodeBlock handles it fully ──
          pre: ({ node, children, ...props }) => <>{children}</>,

          // ── Links ─────────────────────────────────────────────────────────
          a: ({ node, ...props }) => (
            <a
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-4"
              {...props}
            />
          ),

          // ── HR ────────────────────────────────────────────────────────────
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-slate-100" {...props} />
          ),

          // ── Images ────────────────────────────────────────────────────────
          img: ({ node, ...props }) => (
            <img
              className="rounded-xl sm:rounded-2xl max-w-full h-auto mx-auto shadow my-4 sm:my-6"
              loading="lazy"
              decoding="async"
              {...props}
            />
          ),

          // ── Tables ────────────────────────────────────────────────────────
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 sm:my-8 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm -mx-1 sm:mx-0">
              <table
                className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-100 bg-white" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-50/50 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-3 sm:px-6 py-2.5 sm:py-4 text-slate-600 text-[12px] sm:text-[14px] align-middle"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
