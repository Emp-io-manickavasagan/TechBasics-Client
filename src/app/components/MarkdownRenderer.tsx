"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Client component wrapper for ReactMarkdown rendering.
 * Extracted to keep the blog post page as a Server Component.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-slate-600 leading-8 mb-6 text-[15px] sm:text-[16px]" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2 text-[15px]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-6 text-slate-600 space-y-2 text-[15px]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-xl px-4 py-3 italic text-slate-500 my-6" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <pre className="bg-slate-900 text-slate-100 p-3 sm:p-5 rounded-xl sm:rounded-2xl overflow-x-auto my-4 sm:my-6 text-[11px] sm:text-[13px] font-mono leading-relaxed shadow-inner border border-slate-800 max-w-full">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-indigo-50 text-indigo-700 font-semibold px-1 sm:px-1.5 py-0.5 rounded text-[11px] sm:text-[13px] font-mono break-all" {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-4" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-slate-100" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-xl sm:rounded-2xl max-w-full h-auto mx-auto shadow my-4 sm:my-6" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 sm:my-8 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm -mx-1 sm:mx-0">
              <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm" {...props} />
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
            <th className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-slate-600 text-[12px] sm:text-[14px] align-middle" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
