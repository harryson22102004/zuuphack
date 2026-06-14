import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const MOCK_LOGS = [
  "[System] Analyzing inter-key latency...",
  "[System] Rhythm variance < 2%. Nominal.",
  "[System] Micro-hesitation detected and logged.",
  "[System] Biometric signature stability: High",
  "[System] Continuous authentication active.",
  "[System] Recalibrating baseline parameters...",
]

const ALERT_LOGS = [
  "[CRITICAL] Unrecognized typing rhythm detected!",
  "[CRITICAL] Dwell time deviation > 400%",
  "[CRITICAL] Flight time pattern mismatch.",
  "[CRITICAL] Initiating lockdown protocols...",
]

export function ExamPage({ onBack }: { onBack?: () => void }) {
  const [isAlert, setIsAlert] = useState(false)
  const [wordCount, setWordCount] = useState(34)
  const [trustScore, setTrustScore] = useState("98.4")
  const [logs, setLogs] = useState<string[]>([
    "[10:12:45] Environmental scan complete.",
    "[10:14:02] Baseline established.",
    "[10:14:45] Flight time stable at 112ms.",
    "[10:18:12] Gaze tracking nominal.",
  ])
  const [waveD, setWaveD] = useState(
    "M0,50 Q10,60 20,40 T40,50 T60,30 T80,60 T100,50 L100,100 L0,100 Z"
  )
  const [timeLeft, setTimeLeft] = useState(58 * 60 + 24)

  const editorRef = useRef<HTMLDivElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Trust score fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAlert) {
        // Fluctuate between 98.0 and 99.9
        const score = (98 + Math.random() * 1.9).toFixed(1)
        setTrustScore(score)
      } else {
        // Fluctuate between 12.0 and 24.0
        const score = (12 + Math.random() * 12).toFixed(1)
        setTrustScore(score)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isAlert])

  // Waveform animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAlert) {
        offsetRef.current += 0.5
        const y = 60 + Math.sin(offsetRef.current) * 10
        setWaveD(
          `M0,50 Q10,${y} 20,40 T40,50 T60,30 T80,60 T100,50 L100,100 L0,100 Z`
        )
      } else {
        const r = () => Math.random() * 100
        setWaveD(
          `M0,50 L10,${r()} L20,${r()} L40,${r()} L60,${r()} L80,${r()} L100,50 L100,100 L0,100 Z`
        )
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isAlert])

  // System Logs generator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = `[${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}]`

      const logSource = isAlert ? ALERT_LOGS : MOCK_LOGS
      const randomLog = logSource[Math.floor(Math.random() * logSource.length)]

      setLogs((prev) => [...prev, `${timeStr} ${randomLog}`].slice(-20))
    }, 3000)
    return () => clearInterval(interval)
  }, [isAlert])

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  // Word count updater
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim()
      const words = text.split(/\s+/).filter(Boolean).length
      setWordCount(words)
    }
  }, [])

  const toggleAlert = () => setIsAlert((prev) => !prev)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "bg-kp-background text-kp-on-background font-kp-inter min-h-screen flex flex-col antialiased kp-scrollbar",
        "selection:bg-kp-primary-container selection:text-kp-on-primary-container"
      )}
    >
      {/* TopAppBar */}
      <nav className="bg-kp-surface/5 fixed top-0 w-full backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-kp-margin-desktop h-16 z-50 transition-colors">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-kp-primary transition-all duration-150 active:scale-95 text-xs font-semibold text-kp-on-surface"
            >
              <span className="material-symbols-outlined text-[16px] leading-[16px]">arrow_back</span>
              <span>Exit Simulator</span>
            </button>
          )}
          <div
            onClick={onBack}
            className={cn(
              "font-kp-inter text-[32px] leading-[40px] tracking-[-0.01em] font-bold text-kp-primary tracking-tighter",
              onBack && "cursor-pointer hover:opacity-85 transition-opacity"
            )}
          >
            KinetiPass
          </div>
        </div>
        {/* Trailing Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info(`Timer: ${formatTime(timeLeft)} remaining. Please write at least 1500 words.`)}
            className="text-kp-primary hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-150 flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>timer</span>
          </button>
          <button
            onClick={() => toast.success(isAlert ? "Biometric Shield is showing CRITICAL lockdown state." : "Biometric Shield is fully active and tracking typing rhythm.")}
            className="text-kp-primary hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-150 flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </button>
          <button
            onClick={() => toast("Biometric Settings", {
              description: "Sensitivity set to 95%. Rhythm Match threshold at 75%."
            })}
            className="text-kp-primary hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-150 flex items-center justify-center"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
          </button>
          <button
            onClick={() => toast.info("Candidate Profile", {
              description: "Name: Harrison | ID: KP-4902 | Status: " + (isAlert ? "FLAGGED" : "VERIFIED")
            })}
            className="ml-4 h-8 w-8 rounded-full bg-kp-surface-variant overflow-hidden border border-white/20 active:scale-95 transition-transform"
          >
            <img
              alt="Candidate Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCkVl5XrhI7LQJF7Snwt8cUiJsMTQ61NIr3ARz3AmsXCaiPImprwqN4Vlg5t2nPXDGmqerR7--IC0HZCbasMpca8UDFNbiAUDM0kt_PM682rBROGgcvgEgFyCdZf9Ni3n22mS4Ee37mIjZJ1feKzMVBJJ3vKsPKpQeQwryBugkL8MFd4Rp4JWZyKgjuhWBmlBpHGxQtHRBxDjKzP3L3uMBFYdpTFNMz9Vl6ag0lF8i1IGletqmbOW_M4iywv4DsaSW4cqSYV1R62RH"
            />
          </button>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="flex-1 pt-24 px-kp-gutter pb-kp-gutter flex flex-col md:flex-row gap-kp-gutter max-w-[1440px] mx-auto w-full h-[calc(100vh)]">
        {/* Left Panel: Exam Workspace (65%) */}
        <section className="w-full md:w-[65%] flex flex-col gap-6 h-full">
          {/* Header Card */}
          <div className="bg-kp-surface-container/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg relative overflow-hidden">
             {isAlert && <div className="absolute inset-0 bg-kp-error/10 animate-kp-pulse-glow pointer-events-none" />}
            <div className="z-10">
              <h1 className="font-kp-inter text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-kp-on-surface">
                Exam: Advanced AI Ethics
              </h1>
              <p className="font-kp-inter text-[14px] leading-[20px] text-kp-on-surface-variant mt-1">
                Section 2: Moral Frameworks in Machine Learning
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-kp-surface-container-high px-4 py-2 rounded-lg border border-kp-outline-variant z-10">
              <span className="material-symbols-outlined text-kp-primary">schedule</span>
              <span className="font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium text-kp-primary tracking-wider text-lg">
                {formatTime(timeLeft)} remaining
              </span>
            </div>
          </div>

          {/* Body: Essay Editor */}
          <div className="bg-kp-surface-container/20 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col flex-1 shadow-lg overflow-hidden">
            {/* Editor Toolbar */}
            <div className="bg-kp-surface-container-low border-b border-white/10 p-3 flex gap-2 overflow-x-auto">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  document.execCommand('bold')
                  toast.success("Text formatted: Bold")
                }}
                className="p-2 text-kp-on-surface-variant hover:text-kp-on-surface hover:bg-white/5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">format_bold</span>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  document.execCommand('italic')
                  toast.success("Text formatted: Italic")
                }}
                className="p-2 text-kp-on-surface-variant hover:text-kp-on-surface hover:bg-white/5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">format_italic</span>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  document.execCommand('underline')
                  toast.success("Text formatted: Underline")
                }}
                className="p-2 text-kp-on-surface-variant hover:text-kp-on-surface hover:bg-white/5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">format_underlined</span>
              </button>
              <div className="w-px h-6 bg-white/10 mx-2 self-center"></div>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  document.execCommand('insertUnorderedList')
                  toast.success("Unordered list inserted")
                }}
                className="p-2 text-kp-on-surface-variant hover:text-kp-on-surface hover:bg-white/5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  document.execCommand('insertOrderedList')
                  toast.success("Ordered list inserted")
                }}
                className="p-2 text-kp-on-surface-variant hover:text-kp-on-surface hover:bg-white/5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">format_list_numbered</span>
              </button>
            </div>

            {/* Text Area */}
            <div className="flex-1 p-8 overflow-y-auto relative">
               {isAlert && <div className="absolute inset-0 bg-kp-error/5 animate-pulse pointer-events-none" />}
              <div
                ref={editorRef}
                className="kp-editor-content font-kp-inter text-[16px] leading-[24px] text-kp-on-surface outline-none min-h-full leading-relaxed relative z-10"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Begin your response here. Analyze the ethical implications of deploying autonomous agents in high-stakes environments..."
                onInput={handleEditorInput}
              >
                <p className="mb-4">
                  The deployment of autonomous agents in critical infrastructure
                  introduces significant ethical dilemmas, primarily centering
                  around the locus of responsibility.
                </p>
                <p>
                  When an algorithmic system, trained on historical data sets,
                  encounters a novel edge-case scenario...
                </p>
              </div>
            </div>

            {/* Word Count Footer */}
            <div className="bg-kp-surface-container-lowest/50 border-t border-white/10 p-3 px-6 flex justify-end">
              <span className="font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium text-kp-outline">
                Words: {wordCount} / 1500 min
              </span>
            </div>
          </div>
        </section>

        {/* Right Panel: AI Biometric Identity Shield (35%) */}
        <aside
          className={cn(
            "w-full md:w-[35%] bg-kp-surface-container-lowest/60 backdrop-blur-2xl border rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 shadow-2xl h-full",
            isAlert ? "border-kp-error/50" : "border-white/10"
          )}
        >
          {/* Panel Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between z-10 bg-kp-surface-container-lowest/80">
            <div className="flex items-center gap-3">
              <span className={cn("material-symbols-outlined", isAlert ? "text-kp-error" : "text-kp-primary")} style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <h2 className={cn("font-kp-inter text-[20px] leading-[28px] font-semibold text-kp-on-surface transition-colors", isAlert && "text-kp-error")}>
                AI Identity Shield
              </h2>
            </div>
            <span className={cn(
              "font-kp-inter text-[12px] leading-[12px] tracking-[0.02em] font-bold px-2 py-1 rounded border transition-colors",
              isAlert ? "bg-kp-error/20 text-kp-error border-kp-error/40 animate-pulse" : "bg-kp-secondary/10 text-kp-secondary border-kp-secondary/20"
            )}>
              {isAlert ? "LOCKDOWN" : "Vigilance Active"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 z-10">
            {/* Top: Status Ring & Trust Score */}
            <div className="flex flex-col items-center justify-center gap-4 relative">
              {/* Trust Score Overlay */}
              <div className="absolute top-0 right-0 flex flex-col items-end">
                <span className="font-kp-mono text-[10px] text-kp-outline uppercase tracking-wider mb-1">Trust Score</span>
                <div className={cn(
                  "font-kp-mono text-xl font-bold transition-colors",
                  isAlert ? "text-kp-error" : "text-kp-secondary"
                )}>
                  {trustScore}%
                </div>
              </div>

              <div
                className={cn(
                  "relative w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-kp-surface-container",
                  isAlert
                    ? "border-kp-error shadow-[0_0_30px_rgba(255,180,171,0.6)]"
                    : "border-kp-secondary animate-kp-pulse-glow"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-5xl transition-colors duration-300",
                    isAlert ? "text-kp-error animate-pulse" : "text-kp-secondary"
                  )}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isAlert ? "warning" : "fingerprint"}
                </span>
                <div className={cn("absolute inset-2 border rounded-full", isAlert ? "border-kp-error/30" : "border-kp-secondary/30")}></div>
                <div className={cn("absolute inset-4 border rounded-full", isAlert ? "border-kp-error/10" : "border-kp-secondary/10")}></div>
              </div>
              <div
                className={cn(
                  "font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium text-center max-w-[80%] transition-colors duration-300",
                  isAlert ? "text-kp-error font-bold text-sm" : "text-kp-secondary"
                )}
              >
                {isAlert
                  ? "ALERT: CRITICAL SECURITY BREACH. UNKNOWN TYPING DNA DETECTED."
                  : `Identity Confirmed: ${trustScore}% Rhythm Match`}
              </div>
            </div>

            {/* Middle: Visualizer */}
            <div className={cn("flex flex-col gap-4 transition-transform duration-75", isAlert && "animate-kp-glitch")}>
              <h3 className="font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium text-kp-outline uppercase tracking-widest">
                Keystroke Dynamics
              </h3>
              {/* Waveform SVG */}
              <div className={cn("h-16 w-full rounded border relative overflow-hidden flex items-end transition-colors", isAlert ? "bg-kp-error/10 border-kp-error/30" : "bg-kp-surface-container-low border-white/5")}>
                <svg className={cn("w-full h-full", isAlert ? "text-kp-error/60" : "text-kp-primary/40")} fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d={waveD} fill="currentColor" opacity="0.3" />
                  <path d="M0,50 Q10,60 20,40 T40,50 T60,30 T80,60 T100,50" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className={cn("absolute left-0 top-0 h-full w-1 animate-pulse", isAlert ? "bg-kp-error" : "bg-kp-primary")}></div>
              </div>

              {/* Bar Charts */}
              <div className="flex justify-between gap-4">
                <div className={cn("flex-1 rounded p-3 border transition-colors", isAlert ? "bg-kp-error/10 border-kp-error/30" : "bg-kp-surface-container-low border-white/5")}>
                  <div className="font-kp-mono text-[10px] text-kp-outline mb-2">Dwell Time (ms)</div>
                  <div className="h-2 bg-kp-surface-variant rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-500", isAlert ? "bg-kp-error" : "bg-kp-secondary")} style={{ width: isAlert ? "95%" : "45%" }}></div>
                  </div>
                  <div className={cn("font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium mt-1 text-right transition-colors", isAlert ? "text-kp-error" : "text-kp-on-surface")}>
                    {isAlert ? "342ms" : "92ms"}
                  </div>
                </div>
                <div className={cn("flex-1 rounded p-3 border transition-colors", isAlert ? "bg-kp-error/10 border-kp-error/30" : "bg-kp-surface-container-low border-white/5")}>
                  <div className="font-kp-mono text-[10px] text-kp-outline mb-2">Flight Time (ms)</div>
                  <div className="h-2 bg-kp-surface-variant rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-500", isAlert ? "bg-kp-error" : "bg-kp-secondary")} style={{ width: isAlert ? "15%" : "60%" }}></div>
                  </div>
                  <div className={cn("font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-medium mt-1 text-right transition-colors", isAlert ? "text-kp-error" : "text-kp-on-surface")}>
                    {isAlert ? "45ms" : "112ms"}
                  </div>
                </div>
              </div>
            </div>

            {/* Log: System Status Ticker */}
            <div className={cn("flex-1 min-h-[120px] rounded border p-4 flex flex-col transition-colors", isAlert ? "bg-kp-error/5 border-kp-error/30" : "bg-kp-surface-container-low border-white/5")}>
              <h3 className="font-kp-mono text-[10px] text-kp-outline uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                System Events
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 font-kp-mono text-[11px] kp-scrollbar pr-2">
                {logs.map((log, i) => {
                  const isCrit = log.includes("[CRITICAL]")
                  const match = log.match(/^(\[\d{2}:\d{2}:\d{2}\])(.*)$/)
                  const time = match ? match[1] : ""
                  const msg = match ? match[2] : log

                  return (
                    <div key={i} className="flex gap-2 text-kp-on-surface-variant">
                      <span className="opacity-50 shrink-0">{time}</span>
                      <span className={cn(isCrit ? "text-kp-error font-bold" : "text-kp-secondary")}>{msg}</span>
                    </div>
                  )
                })}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Bottom: Debug Button */}
          <div className="p-6 border-t border-white/5 z-10 bg-kp-surface-container-lowest/80 mt-auto">
            <button
              onClick={toggleAlert}
              className={cn(
                "w-full border p-4 rounded-lg font-kp-mono text-[12px] leading-[16px] tracking-[0.05em] font-bold text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 group",
                isAlert
                  ? "bg-kp-error-container text-kp-error border-kp-error hover:bg-kp-error"
                  : "bg-kp-surface-variant hover:bg-kp-surface-bright text-kp-on-surface border-kp-outline-variant"
              )}
            >
              {isAlert ? (
                <>
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  RESET SENSORS
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm group-hover:text-kp-error transition-colors">bug_report</span>
                  DEBUG: Force Imposter Takeover
                </>
              )}
            </button>
          </div>

          {/* Background Alert Overlay */}
          <div className={cn("absolute inset-0 pointer-events-none transition-colors duration-500 z-0", isAlert ? "animate-kp-flash-bg bg-kp-error-container/20" : "bg-kp-error-container/0")}></div>
        </aside>
      </main>
    </div>
  )
}
