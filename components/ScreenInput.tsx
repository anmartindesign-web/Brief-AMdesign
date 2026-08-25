"use client";

import { useEffect, useRef, useState } from "react";
import { BrandBookType, ProjectInputs } from "@/lib/types";
import { getActiveTemplate } from "@/lib/templates";
import { isValidHex, normalizeHex, rasterizeSvgDataUrlToPng, readFileAsDataUrl, readFileAsText } from "@/lib/files";
import { Button, Card } from "./ui";
import { StepHeader } from "./StepHeader";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function ScreenInput({
  brandBookType,
  inputs,
  setInputs,
  onBack,
  onGenerate,
}: {
  brandBookType: BrandBookType;
  inputs: ProjectInputs;
  setInputs: (update: (prev: ProjectInputs) => ProjectInputs) => void;
  onBack: () => void;
  onGenerate: () => void;
}) {
  const template = getActiveTemplate(brandBookType);
  const primaryColorPage = template.pages.find((p) => p.colorInput?.paletteKey === "primary");
  const secondaryColorPage = template.pages.find((p) => p.colorInput?.paletteKey === "secondary");
  const fontPage = template.pages.find((p) => p.fontInput);
  const needsLogo = template.pages.some((p) => p.usesLogo);

  const primaryCount = primaryColorPage?.colorInput?.count ?? 0;
  const secondaryCount = secondaryColorPage?.colorInput?.count ?? 0;
  const fontCount = fontPage?.fontInput?.count ?? 0;

  // Ensure structured arrays match this template's shape.
  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      primaryColors: resize(prev.primaryColors, primaryCount),
      secondaryColors: resize(prev.secondaryColors, secondaryCount),
      fonts: resize(prev.fonts, fontCount, { name: "" }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandBookType]);

  const [briefFileName, setBriefFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [processingLogo, setProcessingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const briefInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function handleBriefFile(file: File) {
    setError(null);
    setBriefFileName(file.name);
    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setExtracting(true);
        const dataUrl = await readFileAsDataUrl(file);
        const base64 = dataUrl.split(",")[1] ?? "";
        const res = await fetch("/api/extract-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mediaType: "application/pdf" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not read PDF.");
        setInputs((prev) => ({ ...prev, brief: data.text }));
      } else {
        const text = await readFileAsText(file);
        setInputs((prev) => ({ ...prev, brief: text }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the brief file.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleLogoFile(file: File) {
    setError(null);
    setLogoFileName(file.name);
    setProcessingLogo(true);
    try {
      const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const dataUrl = await readFileAsDataUrl(file);

      if (isSvg) {
        const png = await rasterizeSvgDataUrlToPng(dataUrl);
        setLogoPreview(png);
        setInputs((prev) => ({ ...prev, logo: { dataUrl: png, mediaType: "image/png", kind: "image" } }));
      } else if (isPdf) {
        setLogoPreview(null);
        setInputs((prev) => ({
          ...prev,
          logo: { dataUrl, mediaType: "application/pdf", kind: "pdf" },
        }));
      } else if (IMAGE_TYPES.includes(file.type)) {
        setLogoPreview(dataUrl);
        setInputs((prev) => ({
          ...prev,
          logo: { dataUrl, mediaType: file.type, kind: "image" },
        }));
      } else {
        throw new Error("Unsupported file type. Use PNG, JPG, SVG or PDF.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process the logo file.");
    } finally {
      setProcessingLogo(false);
    }
  }

  const validHexCount = (colors: { hex: string }[]) =>
    colors.filter((c) => isValidHex(c.hex)).length;

  const briefReady = inputs.brief.trim().length > 0;
  const colorsReady =
    validHexCount(inputs.primaryColors) === primaryCount &&
    validHexCount(inputs.secondaryColors) === secondaryCount;
  const fontsReady = inputs.fonts.every((f) => f.name.trim().length > 0) && inputs.fonts.length === fontCount;
  const canGenerate = briefReady && colorsReady && fontsReady && !extracting && !processingLogo;

  return (
    <div className="min-h-screen pb-28">
      <StepHeader step={2} brandBookLabel={template.label} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-ink-900">Project input</h1>
        <p className="mt-1 text-sm text-ink-500">
          Provide the client brief and visual identity. The AI will determine what matters from
          the brief itself.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Brief */}
        <Card className="mt-6 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Project Brief</h2>
            <div className="flex items-center gap-2">
              {extracting && <span className="text-xs text-ink-400">Reading PDF…</span>}
              <Button size="sm" variant="secondary" onClick={() => briefInputRef.current?.click()}>
                Upload file
              </Button>
              <input
                ref={briefInputRef}
                type="file"
                accept=".txt,.pdf,text/plain,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleBriefFile(e.target.files[0])}
              />
            </div>
          </div>
          {briefFileName && (
            <p className="mt-1 text-xs text-ink-400">Loaded from {briefFileName} — edit freely below.</p>
          )}
          <textarea
            value={inputs.brief}
            onChange={(e) => setInputs((prev) => ({ ...prev, brief: e.target.value }))}
            placeholder="Paste the client brief here — business overview, product/service, audience, positioning, personality, differentiators, anything the client shared…"
            rows={9}
            className="focus-ring mt-3 w-full resize-none rounded-xl border border-ink-200 bg-ink-50/50 px-3.5 py-3 text-sm leading-relaxed text-ink-800 placeholder:text-ink-400"
          />
        </Card>

        {/* Logo */}
        {needsLogo && (
          <Card className="mt-5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink-900">Logo / Visual Identity</h2>
                <p className="mt-0.5 text-xs text-ink-400">PNG, JPG, SVG or PDF</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => logoInputRef.current?.click()}>
                Upload logo
              </Button>
              <input
                ref={logoInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.pdf,image/png,image/jpeg,image/svg+xml,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleLogoFile(e.target.files[0])}
              />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50/50">
                {processingLogo ? (
                  <span className="text-[11px] text-ink-400">Processing…</span>
                ) : logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full rounded-xl object-contain p-2" />
                ) : inputs.logo?.kind === "pdf" ? (
                  <span className="text-[11px] font-medium text-ink-500">PDF</span>
                ) : (
                  <span className="text-[11px] text-ink-400">No logo</span>
                )}
              </div>
              <div className="text-xs text-ink-500">
                {logoFileName ? (
                  <p className="font-medium text-ink-700">{logoFileName}</p>
                ) : (
                  <p>No logo uploaded yet. The logo concept can still generate from the brief alone, but visual analysis will be skipped.</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Colors */}
        {(primaryCount > 0 || secondaryCount > 0) && (
          <Card className="mt-5 p-5">
            <h2 className="text-sm font-semibold text-ink-900">Brand Colors</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              Enter the exact codes from the visual identity — the AI names them, it never invents or changes them.
            </p>
            {primaryCount > 0 && (
              <ColorGrid
                label="Primary palette"
                colors={inputs.primaryColors}
                onChange={(colors) => setInputs((prev) => ({ ...prev, primaryColors: colors }))}
              />
            )}
            {secondaryCount > 0 && (
              <ColorGrid
                label="Secondary palette"
                colors={inputs.secondaryColors}
                onChange={(colors) => setInputs((prev) => ({ ...prev, secondaryColors: colors }))}
              />
            )}
          </Card>
        )}

        {/* Typography */}
        {fontCount > 0 && (
          <Card className="mt-5 p-5">
            <h2 className="text-sm font-semibold text-ink-900">Typography</h2>
            <p className="mt-0.5 text-xs text-ink-400">The exact font names used in the visual identity.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {inputs.fonts.map((font, i) => (
                <input
                  key={i}
                  value={font.name}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      fonts: prev.fonts.map((f, idx) => (idx === i ? { name: e.target.value } : f)),
                    }))
                  }
                  placeholder={i === 0 ? "Primary font name" : "Secondary font name"}
                  className="focus-ring rounded-lg border border-ink-200 bg-ink-50/50 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400"
                />
              ))}
            </div>
          </Card>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            {!canGenerate && (
              <span className="text-xs text-ink-400">
                {!briefReady ? "Add a brief to continue" : !colorsReady ? "Enter all color codes" : !fontsReady ? "Enter all font names" : ""}
              </span>
            )}
            <Button onClick={onGenerate} disabled={!canGenerate}>
              Generate Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function resize<T>(arr: T[], count: number, fill?: T): T[] {
  const empty = (fill ?? ({ hex: "" } as unknown as T)) as T;
  if (arr.length === count) return arr;
  if (arr.length > count) return arr.slice(0, count);
  return [...arr, ...Array.from({ length: count - arr.length }, () => empty)];
}

function ColorGrid({
  label,
  colors,
  onChange,
}: {
  label: string;
  colors: { hex: string }[];
  onChange: (colors: { hex: string }[]) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-ink-600">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {colors.map((c, i) => {
          const valid = c.hex === "" || isValidHex(c.hex);
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50/50 px-2 py-1.5">
              <span
                className="h-5 w-5 shrink-0 rounded-full border border-ink-200"
                style={{ backgroundColor: isValidHex(c.hex) ? normalizeHex(c.hex) : "#ffffff" }}
              />
              <input
                value={c.hex}
                onChange={(e) => {
                  const next = colors.slice();
                  next[i] = { hex: e.target.value };
                  onChange(next);
                }}
                placeholder="#RRGGBB"
                className={`w-full bg-transparent text-xs font-medium outline-none ${valid ? "text-ink-800" : "text-red-500"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
