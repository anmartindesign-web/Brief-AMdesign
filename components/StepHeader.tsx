"use client";

import { Logomark } from "./ui";

const STEPS = ["Type", "Project", "Generate", "Results", "Checklist"];

export function StepHeader({
  step,
  brandBookLabel,
}: {
  step: number; // 1-5
  brandBookLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-ink-200/70 bg-ink-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2">
          <Logomark className="h-6 w-6 text-turquoise-500" />
          <span className="text-sm font-semibold tracking-tight text-ink-900">
            Brand Book Generator
          </span>
          {brandBookLabel && (
            <span className="ml-2 rounded-full bg-turquoise-100 px-2.5 py-0.5 text-[11px] font-medium text-turquoise-700">
              {brandBookLabel}
            </span>
          )}
        </div>
        <ol className="hidden items-center gap-1.5 sm:flex">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = n === step ? "current" : n < step ? "done" : "upcoming";
            return (
              <li key={label} className="flex items-center gap-1.5">
                <span
                  className={
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold " +
                    (state === "current"
                      ? "bg-turquoise-500 text-white"
                      : state === "done"
                      ? "bg-turquoise-100 text-turquoise-700"
                      : "bg-ink-100 text-ink-400")
                  }
                >
                  {n}
                </span>
                <span
                  className={
                    "text-xs " +
                    (state === "upcoming" ? "text-ink-400" : "text-ink-700 font-medium")
                  }
                >
                  {label}
                </span>
                {n !== STEPS.length && <span className="mx-1 h-px w-4 bg-ink-200" />}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
