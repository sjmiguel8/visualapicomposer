import type { Metadata } from "next"
import WorkflowBuilder from "@/components/workflow-builder"

export const metadata: Metadata = {
  title: "Visual API Composer",
  description: "Visually create and manage API workflows without code",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Visual API Composer</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://github.com/yourusername/visual-api-composer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <WorkflowBuilder />
      </main>
    </div>
  )
}

