"use client";

import { GeneratedContent } from "@/lib/types";
import { normalizeHex } from "@/lib/files";

type Props<T extends GeneratedContent = GeneratedContent> = {
  content: T;
  editing: boolean;
  onChange: (content: T) => void;
};

function EditableText({
  value,
  onChange,
  className = "",
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? Math.max(2, Math.ceil(value.length / 70))}
      className={`focus-ring w-full resize-none rounded-lg border border-turquoise-200 bg-turquoise-50/40 px-3 py-2 text-sm leading-relaxed text-ink-800 ${className}`}
    />
  );
}

function EditableLine({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`focus-ring w-full rounded-lg border border-turquoise-200 bg-turquoise-50/40 px-3 py-1.5 text-sm text-ink-800 ${className}`}
    />
  );
}

function FlagsNote({ flags }: { flags?: string[] }) {
  if (!flags || flags.length === 0) return null;
  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        Flagged for review
      </p>
      <ul className="mt-1 space-y-0.5 text-xs text-amber-800">
        {flags.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}

export function ContentView({ content, editing, onChange }: Props) {
  switch (content.type) {
    case "richText":
      return (
        <div>
          {editing ? (
            <div className="space-y-2">
              {content.paragraphs.map((p, i) => (
                <EditableText
                  key={i}
                  value={p}
                  onChange={(v) =>
                    onChange({ ...content, paragraphs: content.paragraphs.map((x, idx) => (idx === i ? v : x)) })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {content.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </div>
          )}
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "colorPalette":
      return (
        <div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {content.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-200/70 p-2.5">
                <span
                  className="h-10 w-10 shrink-0 rounded-full border border-ink-200"
                  style={{ backgroundColor: normalizeHex(c.hex) }}
                />
                <div className="min-w-0 flex-1">
                  {editing ? (
                    <EditableLine
                      value={c.name}
                      onChange={(v) =>
                        onChange({
                          ...content,
                          colors: content.colors.map((x, idx) => (idx === i ? { ...x, name: v } : x)),
                        })
                      }
                    />
                  ) : (
                    <p className="truncate text-sm font-semibold text-ink-900">{c.name}</p>
                  )}
                  <p className="text-xs font-mono uppercase text-ink-400">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
          {!editing && (
            <div className="mt-3 space-y-1">
              {content.colors.map((c, i) => (
                <p key={i} className="text-xs text-ink-500">
                  <span className="font-medium text-ink-700">{c.name}:</span> {c.rationale}
                </p>
              ))}
            </div>
          )}
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "typography":
      return (
        <div>
          <div className="flex flex-wrap gap-2">
            {content.fonts.map((f, i) => (
              <span
                key={i}
                className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700"
              >
                {f.name} <span className="text-ink-400">· {f.role}</span>
              </span>
            ))}
          </div>
          {editing ? (
            <div className="mt-3 space-y-2">
              {content.paragraphs.map((p, i) => (
                <EditableText
                  key={i}
                  value={p}
                  onChange={(v) =>
                    onChange({ ...content, paragraphs: content.paragraphs.map((x, idx) => (idx === i ? v : x)) })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-2.5">
              {content.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </div>
          )}
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "brandAssociations":
      return (
        <div>
          <div className="flex flex-wrap gap-2">
            {content.associations.map((a, i) =>
              editing ? (
                <input
                  key={i}
                  value={a}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      associations: content.associations.map((x, idx) => (idx === i ? e.target.value : x)),
                    })
                  }
                  className="focus-ring w-28 rounded-full border border-turquoise-200 bg-turquoise-50/40 px-3 py-1 text-center text-sm text-ink-800"
                />
              ) : (
                <span
                  key={i}
                  className="rounded-full bg-turquoise-50 px-3.5 py-1.5 text-sm font-medium text-turquoise-800"
                >
                  {a}
                </span>
              ),
            )}
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "brandCharacteristics":
      return (
        <div className="space-y-4">
          {content.spectrums.map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs font-medium text-ink-500">
                <span>{s.leftLabel}</span>
                <span>{s.rightLabel}</span>
              </div>
              <div className="relative mt-1.5 h-2 rounded-full bg-ink-100">
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-turquoise-500 shadow"
                  style={{ left: `calc(${s.value}% - 7px)` }}
                />
              </div>
              {editing ? (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.value}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      spectrums: content.spectrums.map((x, idx) =>
                        idx === i ? { ...x, value: Number(e.target.value) } : x,
                      ),
                    })
                  }
                  className="mt-1.5 w-full accent-turquoise-500"
                />
              ) : (
                <p className="mt-1.5 text-xs text-ink-500">{s.rationale}</p>
              )}
            </div>
          ))}
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "photographyDirections":
      return (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {content.directions.map((d, i) => (
              <div key={i} className="rounded-xl border border-ink-200/70 p-3">
                {editing ? (
                  <>
                    <EditableLine
                      value={d.title}
                      className="font-semibold"
                      onChange={(v) =>
                        onChange({
                          ...content,
                          directions: content.directions.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                        })
                      }
                    />
                    <EditableText
                      value={d.description}
                      className="mt-2"
                      onChange={(v) =>
                        onChange({
                          ...content,
                          directions: content.directions.map((x, idx) => (idx === i ? { ...x, description: v } : x)),
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-ink-900">{d.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{d.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "visionMission":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-turquoise-600">Vision</p>
            {editing ? (
              <EditableText value={content.vision} className="mt-1.5" onChange={(v) => onChange({ ...content, vision: v })} />
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{content.vision}</p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-turquoise-600">Mission</p>
            {editing ? (
              <EditableText value={content.mission} className="mt-1.5" onChange={(v) => onChange({ ...content, mission: v })} />
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{content.mission}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <FlagsNote flags={content.flags} />
          </div>
        </div>
      );

    case "toneOfVoice":
      return (
        <div>
          {editing ? (
            <EditableText value={content.general} onChange={(v) => onChange({ ...content, general: v })} />
          ) : (
            <p className="text-sm leading-relaxed text-ink-700">{content.general}</p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {content.characteristics.map((c, i) => (
              <div key={i} className="rounded-xl border border-ink-200/70 p-3">
                {editing ? (
                  <>
                    <EditableLine
                      value={c.title}
                      className="font-semibold"
                      onChange={(v) =>
                        onChange({
                          ...content,
                          characteristics: content.characteristics.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                        })
                      }
                    />
                    <EditableText
                      value={c.description}
                      className="mt-2"
                      onChange={(v) =>
                        onChange({
                          ...content,
                          characteristics: content.characteristics.map((x, idx) =>
                            idx === i ? { ...x, description: v } : x,
                          ),
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{c.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "brandLanguage":
      return (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["tone", "personality", "languageStyle"] as const).map((key) => (
              <div key={key}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {key === "languageStyle" ? "Language Style" : key[0].toUpperCase() + key.slice(1)}
                </p>
                {editing ? (
                  <EditableText
                    value={content[key]}
                    className="mt-1"
                    rows={2}
                    onChange={(v) => onChange({ ...content, [key]: v })}
                  />
                ) : (
                  <p className="mt-1 text-sm text-ink-700">{content[key]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-turquoise-600">On-brand examples</p>
            <div className="mt-2 space-y-2">
              {content.onBrand.map((e, i) => (
                <div key={i} className="rounded-lg bg-turquoise-50/60 p-2.5">
                  {editing ? (
                    <>
                      <EditableLine
                        value={e.example}
                        className="italic"
                        onChange={(v) =>
                          onChange({ ...content, onBrand: content.onBrand.map((x, idx) => (idx === i ? { ...x, example: v } : x)) })
                        }
                      />
                      <EditableText
                        value={e.whyItWorks}
                        className="mt-1.5"
                        rows={2}
                        onChange={(v) =>
                          onChange({
                            ...content,
                            onBrand: content.onBrand.map((x, idx) => (idx === i ? { ...x, whyItWorks: v } : x)),
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm italic text-ink-800">&ldquo;{e.example}&rdquo;</p>
                      <p className="mt-1 text-xs text-ink-500">{e.whyItWorks}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">Off-brand examples</p>
            <div className="mt-2 space-y-2">
              {content.offBrand.map((e, i) => (
                <div key={i} className="rounded-lg bg-red-50/60 p-2.5">
                  {editing ? (
                    <>
                      <EditableLine
                        value={e.example}
                        className="italic"
                        onChange={(v) =>
                          onChange({ ...content, offBrand: content.offBrand.map((x, idx) => (idx === i ? { ...x, example: v } : x)) })
                        }
                      />
                      <EditableText
                        value={e.whyItDoesntWork}
                        className="mt-1.5"
                        rows={2}
                        onChange={(v) =>
                          onChange({
                            ...content,
                            offBrand: content.offBrand.map((x, idx) => (idx === i ? { ...x, whyItDoesntWork: v } : x)),
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm italic text-ink-800">&ldquo;{e.example}&rdquo;</p>
                      <p className="mt-1 text-xs text-ink-500">{e.whyItDoesntWork}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );

    case "targetAudience": {
      const listFields: { key: keyof typeof content & string; label: string }[] = [
        { key: "lifestyleMindset", label: "Lifestyle & Mindset" },
        { key: "needsPainPoints", label: "Needs & Pain Points" },
        { key: "motivations", label: "Motivations" },
        { key: "valuesInBrand", label: "What They Value in a Brand" },
        { key: "notLookingFor", label: "What They Are Not Looking For" },
      ];
      return (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Life Stage</p>
              {editing ? (
                <EditableText value={content.lifeStage} rows={2} className="mt-1" onChange={(v) => onChange({ ...content, lifeStage: v })} />
              ) : (
                <p className="mt-1 text-sm text-ink-700">{content.lifeStage}</p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Location</p>
              {editing ? (
                <EditableLine value={content.location} className="mt-1" onChange={(v) => onChange({ ...content, location: v })} />
              ) : (
                <p className="mt-1 text-sm text-ink-700">{content.location}</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {listFields.map(({ key, label }) => {
              const items = content[key] as string[];
              return (
                <div key={key}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                  <ul className="mt-1.5 space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-ink-700">
                        {editing ? (
                          <EditableLine
                            value={item}
                            onChange={(v) =>
                              onChange({ ...content, [key]: items.map((x, idx) => (idx === i ? v : x)) })
                            }
                          />
                        ) : (
                          <>
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-turquoise-400" />
                            <span>{item}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );
    }

    case "photographyStrategy": {
      const listFields: { key: "moodFeel" | "approach" | "whatToAvoid"; label: string }[] = [
        { key: "moodFeel", label: "Mood & Feel" },
        { key: "approach", label: "Approach" },
        { key: "whatToAvoid", label: "What to Avoid" },
      ];
      return (
        <div>
          {editing ? (
            <EditableText value={content.introduction} onChange={(v) => onChange({ ...content, introduction: v })} />
          ) : (
            <p className="text-sm leading-relaxed text-ink-700">{content.introduction}</p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {listFields.map(({ key, label }) => {
              const items = content[key];
              return (
                <div key={key}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                  <ul className="mt-1.5 space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-ink-700">
                        {editing ? (
                          <EditableLine
                            value={item}
                            onChange={(v) =>
                              onChange({ ...content, [key]: items.map((x, idx) => (idx === i ? v : x)) })
                            }
                          />
                        ) : (
                          <>
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-turquoise-400" />
                            <span>{item}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <FlagsNote flags={content.flags} />
        </div>
      );
    }

    default:
      return null;
  }
}
