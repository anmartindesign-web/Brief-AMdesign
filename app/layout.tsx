import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Book Generator",
  description:
    "Transform a client brief and visual identity into ready-to-use brand book content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
