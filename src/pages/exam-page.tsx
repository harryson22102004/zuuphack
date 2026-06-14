import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useKeystrokeDynamics } from "@/hooks/use-keystroke-dynamics"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Fingerprint,
  Timer,
  Activity,
  Zap,
  RotateCcw,
  AlertTriangle,
  Brain,
  Lock,
  Keyboard,
} from "lucide-react"

const EXAM_DURATION_MINUTES = 30
const EXAM_QUESTION = `You are tasked with writing a short essay (200–300 words) on the following topic:

"Discuss the ethical implications of artificial intelligence in modern education. Consider both the potential benefits AI can offer to personalized learning and the risks it poses to equity, privacy, and academic integrity."`

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

interface RhythmBarProps {
  values: number[]
  color: string
}

function RhythmBar({ values, color }: RhythmBarProps) {
  if (values.length === 0) {
    return (
      <div className="flex items-end gap-0.5 h-12">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-muted/40" style={{ height: "20%" }} />
        ))}
      </div>
    )
  }
  const max = Math.max(...values, 1)
  const display = values.slice(-20)
  const padded = Array.from({ length: 20 }, (_, i) => display[i - (20 - display.length)] ?? 0)

  return (
    <div className="flex items-end gap-0.5 h-12">
      {padded.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-200"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            backgroundColor: color,
            opacity: v === 0 ? 0.15 : 0.3 + (i / 20) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

export function ExamPage() {
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60)
  const [examStarted, setExamStarted] = useState(false)
  const [answerText, setAnswerText] = useState("")
  const [showAnomaly, setShowAnomaly] = useState(false)
  const anomalyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { metrics, imposterMode, setImposterMode, handlers, recentDwells, recentFlights, resetMetrics } =
    useKeystrokeDynamics()

  // Flash anomaly notification
  useEffect(() => {
    if (metrics.isAnomaly) {
      setShowAnomaly(true)
      if (anomalyTimeoutRef.current) clearTimeout(anomalyTimeoutRef.current)
    } else {
      anomalyTimeoutRef.current = setTimeout(() => setShowAnomaly(false), 2000)
    }
    return () => {
      if (anomalyTimeoutRef.current) clearTimeout(anomalyTimeoutRef.current)
    }
  }, [metrics.isAnomaly])

  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return
    const interval = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(interval)
  }, [examStarted, timeLeft])

  const statusConfig = {
    idle: {
      label: "STANDBY",
      color: "text-muted-foreground",
      bg: "bg-muted/40",
      border: "border-border/40",
      glow: "",
      Icon: Lock,
    },
    learning: {
      label: "LEARNING PROFILE",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/30",
      glow: "",
      Icon: Brain,
    },
    secure: {
      label: "IDENTITY VERIFIED",
      color: "text-cyber-green",
      bg: "bg-cyber-green/10",
      border: "border-cyber-green/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      Icon: ShieldCheck,
    },
    caution: {
      label: "ANOMALY DETECTED",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30",
      glow: "",
      Icon: ShieldAlert,
    },
    critical: {
      label: "IDENTITY FAILED",
      color: "text-cyber-red",
      bg: "bg-cyber-red/10",
      border: "border-cyber-red/30",
      glow: "animate-flash-danger",
      Icon: ShieldX,
    },
  }

  const currentStatus = statusConfig[metrics.status]
  const StatusIcon = currentStatus.Icon
  const isAnomaly = metrics.isAnomaly

  const handleReset = () => {
    resetMetrics()
    setAnswerText("")
    setTimeLeft(EXAM_DURATION_MINUTES * 60)
    setExamStarted(false)
    setShowAnomaly(false)
    setImposterMode(false)
  }

  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className={cn("min-h-screen bg-background transition-all duration-500", isAnomaly && "bg-cyber-red/5")}>
      {/* Anomaly Alert Banner */}
      {showAnomaly && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyber-red text-cyber-red-foreground shadow-[0_0_40px_rgba(239,68,68,0.5)] pointer-events-auto">
            <AlertTriangle className="size-5 animate-pulse" />
            <span className="font-semibold">
              Biometric Anomaly Detected: Identity Verification Failed
            </span>
            <AlertTriangle className="size-5 animate-pulse" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Fingerprint className="size-5 text-cyber-green" />
              KinetiPass Exam Simulator
            </h1>
            <p className="text-sm text-muted-foreground">CS301 — Artificial Intelligence Ethics</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm transition-all",
                timeLeft < 300 ? "border-cyber-red/40 text-cyber-red bg-cyber-red/10" : "border-border/40 text-foreground bg-card"
              )}
            >
              <Timer className={cn("size-4", timeLeft < 300 && "animate-pulse text-cyber-red")} />
              {formatTime(timeLeft)}
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Exam Panel */}
          <div className="xl:col-span-2 space-y-4">
            <Card
              className={cn(
                "border transition-all duration-500",
                isAnomaly
                  ? "border-cyber-red/60 animate-flash-danger"
                  : metrics.status === "secure"
                  ? "border-cyber-green/30"
                  : metrics.status === "caution"
                  ? "border-yellow-400/30"
                  : "border-border/40"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Exam Question</CardTitle>
                  <Badge
                    variant="outline"
                    className="text-xs border-cyber-green/30 text-cyber-green"
                  >
                    Essay — 200–300 Words
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 mb-4">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {EXAM_QUESTION}
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={answerText}
                    onChange={(e) => {
                      setAnswerText(e.target.value)
                      if (!examStarted && e.target.value.length > 0) setExamStarted(true)
                    }}
                    onKeyDown={handlers.onKeyDown}
                    onKeyUp={handlers.onKeyUp}
                    placeholder="Begin typing your answer here... Your keystroke dynamics will be captured as you type."
                    className={cn(
                      "w-full min-h-64 resize-none rounded-lg border bg-card/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition-all duration-300 leading-relaxed",
                      isAnomaly
                        ? "border-cyber-red/50 focus:border-cyber-red"
                        : metrics.status === "secure"
                        ? "border-cyber-green/30 focus:border-cyber-green/60"
                        : "border-border/40 focus:border-ring"
                    )}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
                    {wordCount} words
                  </div>
                </div>

                {!examStarted && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Keyboard className="size-4" />
                    <span>Start typing above to begin biometric analysis</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Biometric Sidebar */}
          <div className="space-y-4">
            {/* Status Card */}
            <Card
              className={cn(
                "border transition-all duration-500",
                currentStatus.border,
                currentStatus.glow
              )}
            >
              <CardContent className="pt-6 pb-5">
                <div className="text-center mb-5">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-4 transition-all duration-500",
                      currentStatus.bg,
                      currentStatus.border
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        "size-8 transition-all duration-500",
                        currentStatus.color,
                        isAnomaly && "animate-pulse"
                      )}
                    />
                  </div>
                  <div className={cn("text-xs font-bold tracking-widest mb-1", currentStatus.color)}>
                    {currentStatus.label}
                  </div>
                  <div className="text-2xs text-muted-foreground text-xs">
                    {metrics.status === "idle" && "Waiting for input"}
                    {metrics.status === "learning" && `Building baseline... ${metrics.keystrokesUntilBaseline} keystrokes remaining`}
                    {metrics.status === "secure" && "Typing pattern matches baseline"}
                    {metrics.status === "caution" && "Rhythm deviation detected"}
                    {metrics.status === "critical" && "Identity mismatch — exam flagged"}
                  </div>
                </div>

                {/* Rhythm Match */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Rhythm Match</span>
                    <span
                      className={cn(
                        "text-sm font-bold font-mono",
                        isAnomaly
                          ? "text-cyber-red"
                          : metrics.status === "caution"
                          ? "text-yellow-400"
                          : "text-cyber-green"
                      )}
                    >
                      {metrics.status === "idle" ? "—" : metrics.status === "learning" ? "..." : `${metrics.rhythmMatch}%`}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isAnomaly
                          ? "bg-cyber-red"
                          : metrics.status === "caution"
                          ? "bg-yellow-400"
                          : metrics.status === "learning"
                          ? "bg-blue-400"
                          : "bg-cyber-green"
                      )}
                      style={{ width: metrics.status === "idle" ? "0%" : metrics.status === "learning" ? "30%" : `${metrics.rhythmMatch}%` }}
                    />
                  </div>
                </div>

                <Separator className="mb-4 opacity-30" />

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Zap,
                      label: "Dwell Time",
                      value: metrics.totalKeystrokes > 0 ? `${metrics.dwellTime}ms` : "—",
                      color: "text-blue-400",
                    },
                    {
                      icon: Activity,
                      label: "Flight Time",
                      value: metrics.totalKeystrokes > 1 ? `${metrics.flightTime}ms` : "—",
                      color: "text-purple-400",
                    },
                    {
                      icon: Fingerprint,
                      label: "Keystrokes",
                      value: String(metrics.totalKeystrokes),
                      color: "text-cyber-green",
                    },
                    {
                      icon: Timer,
                      label: "Status",
                      value: metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1),
                      color: currentStatus.color,
                    },
                  ].map((m) => {
                    const Icon = m.icon
                    return (
                      <div key={m.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
                        <Icon className={cn("size-3.5 shrink-0", m.color)} />
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground truncate">{m.label}</div>
                          <div className={cn("text-xs font-bold font-mono", m.color)}>{m.value}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Dwell Time Visualization */}
            <Card className="border-border/40">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Dwell Times
                  </span>
                  <span className="text-xs font-mono text-blue-400">last 20 keys</span>
                </div>
                <RhythmBar values={recentDwells} color="oklch(0.488 0.243 264.376)" />
              </CardContent>
            </Card>

            {/* Flight Time Visualization */}
            <Card className="border-border/40">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Flight Times
                  </span>
                  <span className="text-xs font-mono text-purple-400">last 20 keys</span>
                </div>
                <RhythmBar values={recentFlights} color="oklch(0.627 0.265 303.9)" />
              </CardContent>
            </Card>

            {/* Imposter Toggle */}
            <Card
              className={cn(
                "border transition-all duration-300",
                imposterMode ? "border-cyber-red/50 bg-cyber-red/5" : "border-border/40"
              )}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={cn("size-4", imposterMode ? "text-cyber-red animate-pulse" : "text-muted-foreground")}
                    />
                    <div>
                      <Label
                        htmlFor="imposter-toggle"
                        className={cn("text-sm font-medium cursor-pointer", imposterMode && "text-cyber-red")}
                      >
                        Simulate Imposter
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Inject biometric anomalies
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="imposter-toggle"
                    checked={imposterMode}
                    onCheckedChange={setImposterMode}
                    className={cn(imposterMode && "data-[state=checked]:bg-cyber-red")}
                  />
                </div>
                {imposterMode && (
                  <div className="mt-3 p-2.5 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                    <p className="text-xs text-cyber-red">
                      Active: Keystroke timing is being artificially distorted to simulate a different user.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
