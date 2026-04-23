import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Transparent Translation",
  description: "A translation with nothing hidden. Hebrew Bible in English, Portuguese, and German.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
