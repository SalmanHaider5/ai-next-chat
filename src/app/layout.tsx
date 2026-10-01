import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "AI Chat Workspace",
  description: "AI-powered workspace for LLM, RAG and AI agents",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <AppLayout />
      </body>
    </html>
  );
}
