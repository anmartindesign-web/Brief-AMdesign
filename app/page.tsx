"use client";

import { useCallback, useState } from "react";
import { BrandBookType, GeneratedContent, GeneratedPage, ProjectInputs, TemplateConfig } from "@/lib/types";
import { getActiveTemplate } from "@/lib/templates";
import { emptyContent, emptyProjectInputs } from "@/lib/defaults";
import { ScreenStart } from "@/components/ScreenStart";
import { ScreenInput } from "@/components/ScreenInput";
import { ScreenGenerating } from "@/components/ScreenGenerating";
import { ScreenResults } from "@/components/ScreenResults";
import { ScreenChecklist } from "@/components/ScreenChecklist";

type Screen = "start" | "input" | "generating" | "results" | "checklist";

const CONCURRENCY = 3;

async function fetchPageContent(
  templateKey: string,
  pageId: string,
  inputs: ProjectInputs,
  regenerate: boolean,
): Promise<{ content?: GeneratedContent; error?: string }> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey, pageId, inputs, regenerate }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Generation failed." };
    return { content: data.content as GeneratedContent };
  } catch {
    return { error: "Network error while generating this section." };
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [brandBookType, setBrandBookType] = useState<BrandBookType | null>(null);
  const [inputs, setInputs] = useState<ProjectInputs>(emptyProjectInputs());
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const template = brandBookType ? getActiveTemplate(brandBookType) : null;

  const updatePage = useCallback((pageId: string, patch: Partial<GeneratedPage>) => {
    setPages((prev) => prev.map((p) => (p.pageId === pageId ? { ...p, ...patch } : p)));
  }, []);

  async function runGeneration(tpl: TemplateConfig, currentInputs: ProjectInputs, pageIds?: string[]) {
    const targetIds = pageIds ?? tpl.pages.map((p) => p.id);
    const queue = [...targetIds];

    async function worker() {
      while (queue.length > 0) {
        const pageId = queue.shift();
        if (!pageId) return;
        const { content, error } = await fetchPageContent(tpl.key, pageId, currentInputs, !!pageIds);
        if (content) {
          updatePage(pageId, { content, status: "idle", edited: false, error: undefined });
        } else {
          updatePage(pageId, { status: "error", error });
        }
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }

  function handleSelectType(type: BrandBookType) {
    setBrandBookType(type);
  }

  function goToInput() {
    if (!brandBookType) return;
    setScreen("input");
  }

  async function handleGenerate() {
    if (!template) return;
    setPages(
      template.pages.map((p) => ({
        pageId: p.id,
        pageNumber: p.pageNumber,
        pageName: p.pageName,
        contentType: p.contentType,
        content: emptyContent(p.contentType),
        edited: false,
        status: "generating" as const,
      })),
    );
    setScreen("generating");
    await runGeneration(template, inputs);
    setScreen("results");
  }

  async function handleRegenerate(pageId: string) {
    if (!template) return;
    updatePage(pageId, { status: "generating", error: undefined });
    await runGeneration(template, inputs, [pageId]);
  }

  function handleChangePageContent(pageId: string, content: GeneratedContent) {
    updatePage(pageId, { content, edited: true });
  }

  function handleRestart() {
    setScreen("start");
    setBrandBookType(null);
    setInputs(emptyProjectInputs());
    setPages([]);
    setChecked({});
  }

  if (screen === "start") {
    return <ScreenStart selected={brandBookType} onSelect={handleSelectType} onNext={goToInput} />;
  }

  if (screen === "input" && brandBookType) {
    return (
      <ScreenInput
        brandBookType={brandBookType}
        inputs={inputs}
        setInputs={setInputs}
        onBack={() => setScreen("start")}
        onGenerate={handleGenerate}
      />
    );
  }

  if (screen === "generating" && template) {
    return <ScreenGenerating pages={pages} brandBookLabel={template.label} />;
  }

  if (screen === "results" && template) {
    return (
      <ScreenResults
        pages={pages}
        brandBookLabel={template.label}
        onChangePageContent={handleChangePageContent}
        onRegenerate={handleRegenerate}
        onBack={() => setScreen("input")}
        onNext={() => setScreen("checklist")}
      />
    );
  }

  if (screen === "checklist" && template) {
    return (
      <ScreenChecklist
        brandBookLabel={template.label}
        checklist={template.checklist}
        checked={checked}
        onToggle={(key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
        onBack={() => setScreen("results")}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
