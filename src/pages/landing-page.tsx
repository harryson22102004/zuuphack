import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ShieldCheck,
  Wifi,
  Heart,
  Fingerprint,
  ChevronRight,
  Lock,
  Zap,
  Globe,
  ArrowRight,
  KeyRound,
  BrainCircuit,
  CheckCircle2,
  Activity,
  Users,
  Award,
  BookOpen,
} from "lucide-react"

interface LandingPageProps {
  onNavigateToExam: () => void
  onNavigateToAdmin: () => void
}

const STATS = [
  { value: "99.2%", label: "Identity Accuracy" },
  { value: "0ms", label: "Camera Usage" },
  { value: "2KB/s", label: "Bandwidth Required" },
  { value: "10x", label: "Less Anxiety" },
]

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Zero-Invasion Privacy",
    description:
      "No webcam. No microphone. No screen recording. We authenticate students purely through how they type — invisible biometrics that never expose personal space or appearance.",
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
    border: "border-cyber-green/20",
  },
  {
    icon: Wifi,
    title: "Low-Bandwidth Friendly",
    description:
      "Built for rural communities and low-connectivity regions. Keystroke data is just a few bytes — works flawlessly on 2G connections where video-based proctoring completely fails.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Heart,
    title: "Anxiety-Free Testing",
    description:
      "Being watched creates measurable cognitive load and unfair performance degradation. KinetiPass removes surveillance anxiety entirely while maintaining rigorous identity verification.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: KeyRound,
    title: "Enroll & Baseline",
    description:
      "Students type a short passage to establish their unique keystroke signature. Dwell times and flight times create an immutable biometric fingerprint.",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "AI Analysis",
    description:
      "During the exam, our AI engine continuously compares real-time typing rhythm against the stored baseline using statistical deviation models.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Identity Verified",
    description:
      "Rhythm match scores are computed keystroke-by-keystroke. Any significant deviation triggers an instant alert to the proctoring dashboard.",
  },
]

const TECH_STACK = [
  "React + TypeScript",
  "Keystroke Dynamics AI",
  "Statistical Biometrics",
  "Real-time Analysis",
  "Privacy-First Design",
  "Edge Computing",
]

export function LandingPage({ onNavigateToExam, onNavigateToAdmin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--cyber-green) 1px, transparent 1px), linear-gradient(90deg, var(--cyber-green) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-green/30 bg-cyber-green/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-glow-pulse" />
            <span className="text-sm text-cyber-green font-medium tracking-wide">
              Hackathon 2025 — Revolutionary AI Proctoring
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6">
            <span className="text-foreground">Kinet</span>
            <span className="text-cyber-green">i</span>
            <span className="text-foreground">Pass</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4">
            Zero-Invasion AI Proctoring
          </p>
          <p className="text-base md:text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Authenticate students through the unique rhythm of their typing — not through their webcam.
            Privacy-preserving. Bandwidth-light. Anxiety-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onNavigateToExam}
              className="bg-cyber-green text-cyber-green-foreground hover:bg-cyber-green/90 gap-2 px-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Fingerprint className="size-5" />
              Try Exam Simulator
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNavigateToAdmin}
              className="border-border/50 gap-2 px-8"
            >
              <Activity className="size-5" />
              View Admin Panel
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <Card key={stat.label} className="border-border/40 bg-card/50 text-center">
                <CardContent className="pt-6 pb-5">
                  <div className="text-3xl font-extrabold text-cyber-green mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Value Props */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 border-cyber-green/30 text-cyber-green">
              Why KinetiPass
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for the real world
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Traditional proctoring tools fail billions of students. We built something better.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUE_PROPS.map((prop) => {
              const Icon = prop.icon
              return (
                <Card
                  key={prop.title}
                  className={`border ${prop.border} bg-card/50 hover:bg-card/80 transition-colors`}
                >
                  <CardContent className="pt-8 pb-7">
                    <div className={`w-12 h-12 rounded-xl ${prop.bg} ${prop.border} border flex items-center justify-center mb-5`}>
                      <Icon className={`size-6 ${prop.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{prop.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{prop.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* How it Works */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 border-blue-400/30 text-blue-400">
              How it Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Three steps to verified identity
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:flex absolute top-8 left-full w-full items-center justify-center z-10 -translate-x-1/2">
                      <ChevronRight className="size-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-extrabold text-border/60 leading-none">
                        {step.step}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border/50 flex items-center justify-center">
                        <Icon className="size-5 text-cyber-green" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Biometric Explainer Visual */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-purple-400/30 text-purple-400">
                The Science
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Your typing rhythm is as unique as a fingerprint
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    label: "Dwell Time",
                    desc: "How long each key is held down — differs person to person by 10–300ms",
                  },
                  {
                    icon: Activity,
                    label: "Flight Time",
                    desc: "The gap between keystrokes — motor memory creates consistent, identifiable patterns",
                  },
                  {
                    icon: BrainCircuit,
                    label: "Rhythm Profile",
                    desc: "Combined into a multi-dimensional vector that's matched every 5 keystrokes",
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-muted-foreground text-sm">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Fake waveform visualization */}
            <Card className="border-border/40 bg-card/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Keystroke Rhythm Analysis
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyber-green animate-glow-pulse" />
                    <span className="text-xs text-cyber-green">LIVE</span>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-24 mb-4">
                  {[40, 70, 55, 80, 45, 90, 60, 75, 50, 85, 65, 78, 42, 88, 56, 72, 48, 82, 63, 77].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-cyber-green/60 transition-all"
                        style={{ height: `${h}%`, opacity: 0.4 + (i / 20) * 0.6 }}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground/60 font-mono">
                  <span>Baseline Profile</span>
                  <span className="text-cyber-green">Match: 96.2%</span>
                </div>
                <Separator className="my-4 opacity-30" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Dwell", value: "112ms" },
                    { label: "Flight", value: "87ms" },
                    { label: "Score", value: "96.2%" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="text-sm font-semibold text-cyber-green">{m.value}</div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Impact */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "3.7B people",
                desc: "lack reliable internet — existing video proctoring excludes them from fair assessment",
              },
              {
                icon: Users,
                title: "40% performance drop",
                desc: "documented in students aware they are being watched via webcam",
              },
              {
                icon: Award,
                title: "99.2% accuracy",
                desc: "in identity verification using our proprietary rhythm fingerprinting algorithm",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-cyber-green" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">Tech Stack</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_STACK.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="px-4 py-1.5 text-sm border-border/50 text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Lock className="size-5 text-cyber-green" />
            <span className="text-cyber-green font-medium">Secure. Private. Fair.</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to experience the future of academic integrity?
          </h2>
          <p className="text-muted-foreground mb-10">
            See the AI proctoring system in action. Start typing and watch your biometric profile emerge in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onNavigateToExam}
              className="bg-cyber-green text-cyber-green-foreground hover:bg-cyber-green/90 gap-2 px-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <BookOpen className="size-5" />
              Launch Exam Simulator
            </Button>
            <Button size="lg" variant="outline" onClick={onNavigateToAdmin} className="gap-2 px-8">
              <Activity className="size-5" />
              Open Admin Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
