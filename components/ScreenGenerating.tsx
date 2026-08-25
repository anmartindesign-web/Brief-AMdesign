"use client";

import { useEffect, useState } from "react";
import { GeneratedPage } from "@/lib/types";
import { StepHeader } from "./StepHeader";
import { IconCheck } from "./ui";

const ROTATING_MESSAGES = [
  "Analyzing brand strategy…",
  "Reading the client brief…",
  "Reviewing visual identity…",
  "Mapping audience and positioning…",
  "Connecting the logo to the brand strategy…",
  "Drafting strategic copy…",
  "Preparing brand book content…",
];

export function ScreenGenerating({
  pages,
  brandBookLabel,
}: {
  pages: GeneratedPage[];
  brandBookLabel: string;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const doneCount = pages.filter((p) => p.status === "idle").length;

  return (
    <div className="min-h-screen">
      <StepHeader step={3} brandBookLabel={brandBookLabel} />
      <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute h-16 w-16 animate-ping rounded-full bg-turquoise-300/40" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-turquoise-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 animate-spin">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2.5} strokeOpacity={0.25} />
              <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <p className="mt-6 text-sm font-medium text-ink-800 transition-opacity duration-300">
          {ROTATING_MESSAGES[messageIndex]}
        </p>
        <p className="mt-1 text-xs text-ink-400">
          {doneCount} of {pages.length} sections ready
        </p>

        <ul className="mt-8 w-full space-y-1.5 text-left">
          {pages.map((page) => (
            <li
              key={page.pageId}
              className="flex items-center gap-3 rounded-lg border border-ink-200/70 bg-white px-3.5 py-2.5"
            >
              <span
                className={
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                  (page.status === "idle"
                    ? "bg-turquoise-500 text-white"
                    : page.status === "error"
                    ? "bg-red-100 text-red-500"
                    : "bg-ink-100 text-ink-400")
                }
              >
                {page.status === "idle" ? (
                  <IconCheck className="h-3 w-3" />
                ) : page.status === "error" ? (
                  "!"
                ) : (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                )}
              </span>
              <span className="text-xs font-medium text-ink-400">P{page.pageNumber}</span>
              <span className="text-sm text-ink-700">{page.pageName}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
