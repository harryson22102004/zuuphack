import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { LandingPage } from "@/pages/landing-page"
import { ExamPage } from "@/pages/exam-page"
import { AdminPage } from "@/pages/admin-page"
import { Fingerprint, BookOpen, BarChart3, Home } from "lucide-react"

type Tab = "home" | "exam" | "admin"

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "exam", label: "Exam Simulator", icon: BookOpen },
  { id: "admin", label: "Admin Panel", icon: BarChart3 },
]

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
                <Fingerprint className="size-4 text-cyber-green" />
              </div>
              <span className="font-bold text-base tracking-tight">
                Kineti<span className="text-cyber-green">Pass</span>
              </span>
              <Badge
                variant="outline"
                className="hidden sm:flex text-xs border-cyber-green/30 text-cyber-green/70 py-0 px-1.5"
              >
                AI Proctoring
              </Badge>
            </button>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "gap-2 text-sm transition-all",
                      isActive
                        ? "text-cyber-green bg-cyber-green/10 hover:bg-cyber-green/15"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Active tab indicator */}
        <div className="relative h-0.5 bg-border/20">
          <div
            className="absolute top-0 h-full bg-cyber-green/60 transition-all duration-300 rounded-full"
            style={{
              left: activeTab === "home" ? "0%" : activeTab === "exam" ? "33.33%" : "66.66%",
              width: "33.33%",
            }}
          />
        </div>
      </header>

      {/* Page Content with top padding for fixed header */}
      <main className="pt-14">
        {activeTab === "home" && (
          <LandingPage
            onNavigateToExam={() => setActiveTab("exam")}
            onNavigateToAdmin={() => setActiveTab("admin")}
          />
        )}
        {activeTab === "exam" && <ExamPage />}
        {activeTab === "admin" && <AdminPage />}
      </main>

      {/* Footer (only on home page) */}
      {activeTab === "home" && (
        <footer className="border-t border-border/20 bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="size-4 text-cyber-green" />
                <span className="text-sm font-semibold">
                  Kineti<span className="text-cyber-green">Pass</span>
                </span>
                <Separator orientation="vertical" className="h-4 mx-1 opacity-30" />
                <span className="text-xs text-muted-foreground">Zero-Invasion AI Proctoring</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Built for Hackathon 2025 — Privacy-first academic integrity
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
