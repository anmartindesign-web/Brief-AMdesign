"use client";

import { useState } from "react";
import { GeneratedPage } from "@/lib/types";
import { getCopyText, characterCount } from "@/lib/format";
import { Button, IconCheck, IconCopy, IconEdit, IconRefresh, Pill } from "./ui";
import { ContentView } from "./ContentView";

export function PageCard({
  page,
  onChange,
  onRegenerate,
}: {
  page: GeneratedPage;
  onChange: (content: GeneratedPage["content"]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const busy = page.status === "generating";
  const chars = page.status === "idle" ? characterCount(page.content) : null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getCopyText(page.content));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently ignore, Copy remains available to retry
    }
  }

  return (
    <section
      id={`page-${page.pageId}`}
      className="rounded-2xl border border-ink-200/70 bg-white shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-semibold tracking-wide text-white">
            PAGE {page.pageNumber}
          </span>
          <h3 className="text-sm font-semibold text-ink-900">{page.pageName}</h3>
          {page.edited && <Pill tone="amber">Edited</Pill>}
          {chars != null && <Pill>{chars} chars</Pill>}
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={handleCopy} disabled={busy}>
            {copied ? <IconCheck className="h-3.5 w-3.5 text-turquoise-600" /> : <IconCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant={editing ? "primary" : "ghost"} onClick={() => setEditing((v) => !v)} disabled={busy}>
            <IconEdit className="h-3.5 w-3.5" />
            {editing ? "Done" : "Edit"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={busy}>
            <IconRefresh className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      <div className="px-5 py-4">
        {busy ? (
          <div className="space-y-2 py-2">
            <div className="h-3 w-5/6 animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-ink-100" />
          </div>
        ) : page.status === "error" ? (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            <span>{page.error || "Generation failed."}</span>
            <Button size="sm" variant="secondary" onClick={onRegenerate}>
              Try again
            </Button>
          </div>
        ) : (
          <ContentView content={page.content} editing={editing} onChange={onChange} />
        )}
      </div>
    </section>
  );
}
