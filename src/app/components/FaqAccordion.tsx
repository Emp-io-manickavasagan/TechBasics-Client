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
    if (/^#{1,3}\s+/.test(line)) {
      flush();
      currentQ = line.replace(/^#{1,3}\s+/, "").trim();
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
    <section style={{ width: "100%", marginTop: "2.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "2.5rem" }}>
      {/* Section Header */}
      <h3 style={{
        fontSize: "1.125rem",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        <HelpCircle style={{ height: "1.25rem", width: "1.25rem", color: "#6366f1", flexShrink: 0 }} />
        Most People Asked
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: "1rem",
                border: isOpen ? "1px solid #c7d2fe" : "1px solid #f1f5f9",
                background: "#ffffff",
                overflow: "hidden",
                boxShadow: isOpen ? "0 1px 4px 0 rgba(99,102,241,0.07)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Question / Toggle Button */}
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  textAlign: "left",
                  cursor: "pointer",
                  border: "none",
                  background: isOpen ? "rgba(238,242,255,0.6)" : "#ffffff",
                  transition: "background 0.2s",
                }}
              >
                <span style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: isOpen ? "#4338ca" : "#1e293b",
                  transition: "color 0.2s",
                }}>
                  {item.question}
                </span>
                <ChevronDown
                  style={{
                    height: "1rem",
                    width: "1rem",
                    flexShrink: 0,
                    color: isOpen ? "#6366f1" : "#94a3b8",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s, color 0.2s",
                  }}
                />
              </button>

              {/* Answer — animated expand using max-height */}
              <div
                style={{
                  maxHeight: isOpen ? "600px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.35s ease-in-out",
                }}
              >
                <div
                  className="prose"
                  style={{
                    padding: "0.25rem 1.25rem 1.25rem",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "#475569",
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {item.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
