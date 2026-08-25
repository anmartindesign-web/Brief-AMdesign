"use client";

import { GeneratedPage } from "@/lib/types";
import { Button } from "./ui";
import { StepHeader } from "./StepHeader";
import { PageCard } from "./PageCard";

export function ScreenResults({
  pages,
  brandBookLabel,
  onChangePageContent,
  onRegenerate,
  onBack,
  onNext,
}: {
  pages: GeneratedPage[];
  brandBookLabel: string;
  onChangePageContent: (pageId: string, content: GeneratedPage["content"]) => void;
  onRegenerate: (pageId: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allReady = pages.every((p) => p.status === "idle");

  return (
    <div className="min-h-screen pb-24">
      <StepHeader step={4} brandBookLabel={brandBookLabel} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink-900">Generated content</h1>
            <p className="mt-1 text-sm text-ink-500">
              Organized by page. Edit, copy or regenerate any section independently.
            </p>
          </div>
        </div>

        <nav className="mt-5 flex flex-wrap gap-1.5">
          {pages.map((p) => (
            <a
              key={p.pageId}
              href={`#page-${p.pageId}`}
              className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-500 hover:border-turquoise-300 hover:text-turquoise-700"
            >
              P{p.pageNumber}
            </a>
          ))}
        </nav>

        <div className="mt-6 space-y-5">
          {pages.map((page) => (
            <PageCard
              key={page.pageId}
              page={page}
              onChange={(content) => onChangePageContent(page.pageId, content)}
              onRegenerate={() => onRegenerate(page.pageId)}
            />
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!allReady}>
            Continue to Checklist
          </Button>
        </div>
      </div>
    </div>
  );
}
