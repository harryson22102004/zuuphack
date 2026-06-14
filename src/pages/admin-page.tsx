import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Fingerprint,
  ChevronRight,
  Activity,
  Clock,
  BarChart3,
  TrendingUp,
  BookOpen,
} from "lucide-react"

interface ExamRecord {
  id: number
  name: string
  email: string
  exam: string
  status: "verified" | "flagged" | "failed"
  rhythmMatch: number
  date: string
  duration: string
  flaggedAt?: string
}

const EXAM_RECORDS: ExamRecord[] = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice.chen@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "verified",
    rhythmMatch: 96.2,
    date: "2025-06-14",
    duration: "58m",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "flagged",
    rhythmMatch: 67.4,
    date: "2025-06-14",
    duration: "62m",
    flaggedAt: "34m",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.garcia@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "verified",
    rhythmMatch: 94.8,
    date: "2025-06-14",
    duration: "55m",
  },
  {
    id: 4,
    name: "James Lee",
    email: "james.lee@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "failed",
    rhythmMatch: 31.2,
    date: "2025-06-14",
    duration: "45m",
    flaggedAt: "12m",
  },
  {
    id: 5,
    name: "Sophie Brown",
    email: "sophie.brown@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "verified",
    rhythmMatch: 91.5,
    date: "2025-06-14",
    duration: "61m",
  },
  {
    id: 6,
    name: "Raj Patel",
    email: "raj.patel@uni.edu",
    exam: "CS301 Final — AI Ethics",
    status: "flagged",
    rhythmMatch: 72.1,
    date: "2025-06-14",
    duration: "59m",
    flaggedAt: "28m",
  },
  {
    id: 7,
    name: "Emma Wilson",
    email: "emma.wilson@uni.edu",
    exam: "DATA202 Midterm",
    status: "verified",
    rhythmMatch: 88.9,
    date: "2025-06-13",
    duration: "47m",
  },
  {
    id: 8,
    name: "Lucas Martin",
    email: "lucas.martin@uni.edu",
    exam: "DATA202 Midterm",
    status: "failed",
    rhythmMatch: 28.7,
    date: "2025-06-13",
    duration: "38m",
    flaggedAt: "8m",
  },
  {
    id: 9,
    name: "Aisha Nwosu",
    email: "aisha.nwosu@uni.edu",
    exam: "DATA202 Midterm",
    status: "verified",
    rhythmMatch: 93.1,
    date: "2025-06-13",
    duration: "50m",
  },
  {
    id: 10,
    name: "Chen Wei",
    email: "chen.wei@uni.edu",
    exam: "DATA202 Midterm",
    status: "flagged",
    rhythmMatch: 61.8,
    date: "2025-06-13",
    duration: "44m",
    flaggedAt: "22m",
  },
]

function generateKeystrokeProfile(studentId: number, status: string) {
  const seed = studentId * 17
  const isAnomaly = status !== "verified"
  const anomalyStart = Math.floor(Math.random() * 8) + 5

  return Array.from({ length: 20 }, (_, i) => {
    const baseBaseline = 80 + Math.sin(i * 0.8 + seed) * 8
    const baseSession =
      isAnomaly && i > anomalyStart
        ? 20 + Math.random() * 30 + Math.sin(i * 1.5) * 15
        : baseBaseline + (Math.random() - 0.5) * 10
    return {
      t: `T+${(i + 1) * 3}m`,
      baseline: Math.round(Math.max(60, Math.min(100, baseBaseline))),
      session: Math.round(Math.max(10, Math.min(100, baseSession))),
    }
  })
}

const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    icon: ShieldCheck,
    className: "text-cyber-green border-cyber-green/30 bg-cyber-green/10",
    dotColor: "bg-cyber-green",
  },
  flagged: {
    label: "Flagged",
    icon: ShieldAlert,
    className: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    dotColor: "bg-yellow-400",
  },
  failed: {
    label: "Failed",
    icon: ShieldX,
    className: "text-cyber-red border-cyber-red/30 bg-cyber-red/10",
    dotColor: "bg-cyber-red",
  },
}

export function AdminPage() {
  const [search, setSearch] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<ExamRecord | null>(EXAM_RECORDS[1])

  const filtered = EXAM_RECORDS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.exam.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalVerified = EXAM_RECORDS.filter((r) => r.status === "verified").length
  const totalFlagged = EXAM_RECORDS.filter((r) => r.status === "flagged").length
  const totalFailed = EXAM_RECORDS.filter((r) => r.status === "failed").length
  const verifyRate = Math.round((totalVerified / EXAM_RECORDS.length) * 100)
  const chartData = selectedRecord
    ? generateKeystrokeProfile(selectedRecord.id, selectedRecord.status)
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="size-5 text-cyber-green" />
              Proctor Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Exam session monitoring — June 2025</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-glow-pulse" />
            <span className="text-xs text-cyber-green font-medium">Live Monitoring</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Students", value: EXAM_RECORDS.length, color: "text-foreground" },
            { icon: CheckCircle2, label: "Verified", value: totalVerified, color: "text-cyber-green" },
            { icon: AlertTriangle, label: "Flagged", value: totalFlagged, color: "text-yellow-400" },
            { icon: XCircle, label: "Failed", value: totalFailed, color: "text-cyber-red" },
            { icon: TrendingUp, label: "Verify Rate", value: `${verifyRate}%`, color: "text-blue-400" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/40 bg-card/50">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn("size-4", stat.color)} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className={cn("text-2xl font-extrabold", stat.color)}>{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Student Table */}
          <div className="xl:col-span-2">
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="size-4 text-cyber-green" />
                    Exam Records
                  </CardTitle>
                  <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                    {filtered.length} students
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search students or exams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {filtered.map((record, i) => {
                    const cfg = STATUS_CONFIG[record.status]
                    const Icon = cfg.icon
                    const isSelected = selectedRecord?.id === record.id

                    return (
                      <div key={record.id}>
                        {i > 0 && <Separator className="opacity-20" />}
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                            isSelected && "bg-muted/50 border-l-2 border-cyber-green"
                          )}
                        >
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", cfg.className)}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium truncate">{record.name}</span>
                              <span
                                className={cn(
                                  "text-xs font-bold font-mono shrink-0",
                                  record.rhythmMatch >= 80
                                    ? "text-cyber-green"
                                    : record.rhythmMatch >= 60
                                    ? "text-yellow-400"
                                    : "text-cyber-red"
                                )}
                              >
                                {record.rhythmMatch}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground truncate">{record.exam}</span>
                            </div>
                            <div className="mt-1.5">
                              <div className="h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    record.rhythmMatch >= 80
                                      ? "bg-cyber-green"
                                      : record.rhythmMatch >= 60
                                      ? "bg-yellow-400"
                                      : "bg-cyber-red"
                                  )}
                                  style={{ width: `${record.rhythmMatch}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          {isSelected && <ChevronRight className="size-4 text-cyber-green shrink-0" />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="xl:col-span-3 space-y-4">
            {selectedRecord ? (
              <>
                {/* Student Info */}
                <Card
                  className={cn(
                    "border",
                    selectedRecord.status === "verified"
                      ? "border-cyber-green/30"
                      : selectedRecord.status === "failed"
                      ? "border-cyber-red/30"
                      : "border-yellow-400/30"
                  )}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
                          STATUS_CONFIG[selectedRecord.status].className
                        )}
                      >
                        <Fingerprint className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-base">{selectedRecord.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedRecord.email}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("shrink-0", STATUS_CONFIG[selectedRecord.status].className)}
                          >
                            {STATUS_CONFIG[selectedRecord.status].label}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {[
                            { icon: BookOpen, label: "Exam", value: selectedRecord.exam.split(" — ")[0] },
                            { icon: Clock, label: "Duration", value: selectedRecord.duration },
                            { icon: Activity, label: "Rhythm Match", value: `${selectedRecord.rhythmMatch}%` },
                          ].map((m) => {
                            const Icon = m.icon
                            return (
                              <div key={m.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Icon className="size-3.5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                  <div className="text-xs text-muted-foreground">{m.label}</div>
                                  <div className="text-xs font-semibold truncate">{m.value}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {selectedRecord.flaggedAt && (
                          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-cyber-red/10 border border-cyber-red/20">
                            <AlertTriangle className="size-3.5 text-cyber-red shrink-0" />
                            <span className="text-xs text-cyber-red">
                              Anomaly first detected at {selectedRecord.flaggedAt} into the exam
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Keystroke Profile Chart */}
                <Card className="border-border/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="size-4 text-cyber-green" />
                        Keystroke Profile Analysis
                      </CardTitle>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-cyber-green">
                          <span className="w-3 h-0.5 bg-cyber-green inline-block rounded" />
                          Baseline Identity
                        </span>
                        <span className="flex items-center gap-1.5 text-blue-400">
                          <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />
                          Exam Session
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rhythm match score over time — lower divergence = stronger identity match
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                          <defs>
                            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--cyber-green)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--cyber-green)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
                          <XAxis
                            dataKey="t"
                            tick={{ fontSize: 10, fill: "oklch(0.708 0 0)" }}
                            axisLine={false}
                            tickLine={false}
                            interval={4}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: "oklch(0.708 0 0)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--popover)",
                              border: "1px solid oklch(1 0 0 / 10%)",
                              borderRadius: "8px",
                              fontSize: "12px",
                              color: "var(--popover-foreground)",
                            }}
                            formatter={(value, name) => [
                              `${value}%`,
                              name === "baseline" ? "Baseline" : "Session",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="baseline"
                            stroke="var(--cyber-green)"
                            strokeWidth={2}
                            fill="url(#colorBaseline)"
                            dot={false}
                          />
                          <Area
                            type="monotone"
                            dataKey="session"
                            stroke="oklch(0.488 0.243 264.376)"
                            strokeWidth={2}
                            fill="url(#colorSession)"
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Table */}
                <Card className="border-border/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Session Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: "Average Dwell Time", value: `${Math.round(80 + selectedRecord.rhythmMatch * 0.4)}ms`, status: "normal" },
                        { label: "Average Flight Time", value: `${Math.round(60 + selectedRecord.rhythmMatch * 0.3)}ms`, status: "normal" },
                        { label: "Rhythm Consistency", value: `${selectedRecord.rhythmMatch}%`, status: selectedRecord.status },
                        { label: "Anomaly Alerts", value: selectedRecord.status === "verified" ? "0" : selectedRecord.status === "flagged" ? "3" : "12", status: selectedRecord.status },
                        { label: "Exam Result", value: STATUS_CONFIG[selectedRecord.status].label, status: selectedRecord.status },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                          <span className="text-sm text-muted-foreground">{row.label}</span>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              row.status === "verified" || row.status === "normal"
                                ? "text-cyber-green"
                                : row.status === "flagged"
                                ? "text-yellow-400"
                                : "text-cyber-red"
                            )}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border/40 h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Fingerprint className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Select a student to view their profile</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
