"use client";

import { useEffect, useState, useRef } from "react";
import GithubSlugger from "github-slugger";
import { ChevronRight, ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocGroup extends TocItem {
  children: TocItem[];
}

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const tocContainerRef = useRef<HTMLDivElement>(null);

  // Compute headings synchronously so it SSRs
  const slugger = new GithubSlugger();
  const extractedHeadings: TocItem[] = [];
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
  const headingRegex = /^(#{1,3})\s+(.+)$|<h([1-3])[^>]*>(.*?)<\/h\3>/gm;

  let match;
  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const isMarkdown = !!match[1];
    const level = isMarkdown ? match[1].length : parseInt(match[3], 10);
    let title = isMarkdown ? match[2] : match[4];

    title = title.trim();
    const id = slugger.slug(title.replace(/<[^>]+>/g, ""));
    title = title.replace(/<[^>]+>/g, "");
    title = title.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
    title = title.replace(/[*_~`]/g, "");

    extractedHeadings.push({ id, title, level });
  }

  // Group H3s under their preceding H2
  const groupedHeadings: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;

  extractedHeadings.forEach((h) => {
    if (h.level <= 2) {
      currentGroup = { ...h, children: [] };
      groupedHeadings.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.children.push(h);
    } else {
      groupedHeadings.push({ ...h, children: [] });
    }
  });

  // Scroll tracking — ONLY updates the active highlight. Does NOT auto-expand.
  useEffect(() => {
    const headings = extractedHeadings; // capture once at mount
    const handleScroll = () => {
      const elements = headings.map((h) => document.getElementById(h.id));
      let currentActiveId = "";

      for (const el of elements) {
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (headings.length > 0 && window.scrollY < 50) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll the TOC sidebar (not the page) so active item stays visible
  useEffect(() => {
    if (!activeId || !tocContainerRef.current) return;
    const activeEl = tocContainerRef.current.querySelector(
      `[data-id="${activeId}"]`
    ) as HTMLElement | null;
    const asideEl = tocContainerRef.current.closest("aside");
    if (!activeEl || !asideEl) return;

    const pos = activeEl.offsetTop - asideEl.clientHeight / 2;
    asideEl.scrollTo({ top: pos > 0 ? pos : 0, behavior: "smooth" });
  }, [activeId]);

  // Toggle ONE group — never touches any other group
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (groupedHeadings.length === 0) return null;

  return (
    <div ref={tocContainerRef} className="pr-2">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Table of Contents
      </h3>
      <nav className="space-y-0.5">
        {groupedHeadings.map((group) => {
          const isExpanded = expandedIds.has(group.id);
          const hasChildren = group.children.length > 0;
          const isActive = activeId === group.id;
          // Highlight parent when child is active but group is collapsed
          const childIsActive =
            !isExpanded && group.children.some((c) => c.id === activeId);

          return (
            <div key={group.id}>
              {/* Parent heading row — link + chevron side-by-side, no overlap */}
              <div className="flex items-center gap-1">
                <a
                  href={`#${group.id}`}
                  data-id={group.id}
                  className={`flex-1 min-w-0 text-xs py-1.5 pl-2.5 rounded-l transition-all border-l-2 ${
                    isActive || childIsActive
                      ? "border-indigo-500 text-indigo-600 font-semibold bg-indigo-50/60"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(group.id);
                    if (el)
                      window.scrollTo({
                        top: el.offsetTop - 80,
                        behavior: "smooth",
                      });
                  }}
                >
                  <span className="line-clamp-2 leading-relaxed">
                    {group.title}
                  </span>
                </a>

                {/* Chevron: flex-shrink-0 ensures it stays fixed size */}
                {hasChildren && (
                  <button
                    onClick={(e) => toggleExpand(group.id, e)}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    aria-label={
                      isExpanded ? "Collapse subheadings" : "Expand subheadings"
                    }
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Sub-headings — hidden until user clicks the chevron */}
              {hasChildren && isExpanded && (
                <div className="mt-0.5 ml-2.5 space-y-0.5 border-l border-slate-100 pl-2">
                  {group.children.map((child) => {
                    const isChildActive = activeId === child.id;
                    return (
                      <a
                        key={child.id}
                        href={`#${child.id}`}
                        data-id={child.id}
                        className={`block text-[11px] py-1 px-2 rounded transition-all ${
                          isChildActive
                            ? "text-indigo-600 font-semibold bg-indigo-50/60"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(child.id);
                          if (el)
                            window.scrollTo({
                              top: el.offsetTop - 80,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <span className="line-clamp-2 leading-relaxed">
                          {child.title}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
