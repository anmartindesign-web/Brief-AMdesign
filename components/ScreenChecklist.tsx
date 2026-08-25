"use client";

import { ChecklistSection } from "@/lib/types";
import { Button, Card, IconCheck } from "./ui";
import { StepHeader } from "./StepHeader";

export function ScreenChecklist({
  brandBookLabel,
  checklist,
  checked,
  onToggle,
  onBack,
  onRestart,
}: {
  brandBookLabel: string;
  checklist: ChecklistSection[];
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
  onBack: () => void;
  onRestart: () => void;
}) {
  const totalItems = checklist.reduce((n, s) => n + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = totalItems > 0 && checkedCount === totalItems;

  return (
    <div className="min-h-screen pb-24">
      <StepHeader step={5} brandBookLabel={brandBookLabel} />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-ink-900">Final checklist</h1>
        <p className="mt-1 text-sm text-ink-500">
          A last pass before export. This checklist adapts to the {brandBookLabel} template.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-turquoise-500 transition-all"
              style={{ width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink-500">
            {checkedCount}/{totalItems}
          </span>
        </div>

        <div className="mt-6 space-y-5">
          {checklist.map((section) => (
            <Card key={section.title} className="p-5">
              <h2 className="text-sm font-semibold text-ink-900">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => {
                  const key = `${section.title}::${item}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <button
                        onClick={() => onToggle(key)}
                        className="focus-ring flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-ink-50"
                      >
                        <span
                          className={
                            "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 " +
                            (isChecked
                              ? "border-turquoise-500 bg-turquoise-500 text-white"
                              : "border-ink-300 text-transparent")
                          }
                          style={{ height: 18, width: 18 }}
                        >
                          <IconCheck className="h-3 w-3" />
                        </span>
                        <span className={"text-sm " + (isChecked ? "text-ink-400 line-through" : "text-ink-700")}>
                          {item}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>

        {allChecked && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-turquoise-200 bg-turquoise-50 px-4 py-3 text-sm text-turquoise-800">
            <IconCheck className="h-4 w-4" />
            All checks complete — this brand book is ready for export.
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Button variant="ghost" onClick={onBack}>
            Back to content
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            Start new project
          </Button>
        </div>
      </div>
    </div>
  );
}
