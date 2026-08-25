"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  children: ReactNode;
}) {
  const base =
    "focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" };
  const variants = {
    primary: "bg-turquoise-500 text-white hover:bg-turquoise-600 shadow-card",
    secondary: "bg-white text-ink-800 border border-ink-200 hover:border-ink-300 hover:bg-ink-50",
    ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
    danger: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink-200/70 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "turquoise" | "amber";
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-600",
    turquoise: "bg-turquoise-100 text-turquoise-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function TextArea({
  value,
  onChange,
  className = "",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`focus-ring w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-ink-800 placeholder:text-ink-400 ${className}`}
      {...props}
    />
  );
}

export function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 10.5l3.8 3.8L16 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCopy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M4.5 12.5V5.5a1 1 0 011-1h7"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconRefresh({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M16 10a6 6 0 10-1.76 4.24M16 10V6m0 4h-4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEdit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M12.7 4.3l3 3L6.5 16.5l-3.5.8.8-3.5L12.7 4.3z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logomark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth={2} />
      <path d="M11 20V12l5 8 5-8v8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
