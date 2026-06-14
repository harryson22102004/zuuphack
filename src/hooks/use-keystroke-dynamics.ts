import { useState, useRef, useCallback, useEffect } from "react"

export type BiometricStatus = "idle" | "learning" | "secure" | "caution" | "critical"

export interface KeystrokeMetrics {
  dwellTime: number
  flightTime: number
  rhythmMatch: number
  status: BiometricStatus
  isAnomaly: boolean
  totalKeystrokes: number
  keystrokesUntilBaseline: number
}

export interface KeystrokeDynamics {
  metrics: KeystrokeMetrics
  imposterMode: boolean
  setImposterMode: (v: boolean) => void
  handlers: {
    onKeyDown: (e: React.KeyboardEvent) => void
    onKeyUp: (e: React.KeyboardEvent) => void
  }
  recentDwells: number[]
  recentFlights: number[]
  resetMetrics: () => void
}

const BASELINE_SAMPLES = 20
const MAX_HISTORY = 60
const ANOMALY_THRESHOLD = 45
const CAUTION_THRESHOLD = 72

function calcMean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function calcStdDev(arr: number[], mean: number): number {
  if (arr.length < 2) return 50
  const variance = arr.reduce((acc, v) => acc + (v - mean) ** 2, 0) / arr.length
  return Math.sqrt(variance) || 50
}

function calcRhythmMatch(
  currentDwell: number,
  currentFlight: number,
  baselineDwell: number,
  baselineFlight: number,
  stdDwell: number,
  stdFlight: number
): number {
  const dwellSigma = Math.abs(currentDwell - baselineDwell) / stdDwell
  const flightSigma = Math.abs(currentFlight - baselineFlight) / stdFlight
  const deviation = (dwellSigma + flightSigma) / 2
  return Math.max(0, Math.min(100, 100 - deviation * 18))
}

export function useKeystrokeDynamics(): KeystrokeDynamics {
  const [imposterMode, setImposterMode] = useState(false)
  const [metrics, setMetrics] = useState<KeystrokeMetrics>({
    dwellTime: 0,
    flightTime: 0,
    rhythmMatch: 100,
    status: "idle",
    isAnomaly: false,
    totalKeystrokes: 0,
    keystrokesUntilBaseline: BASELINE_SAMPLES,
  })
  const [recentDwells, setRecentDwells] = useState<number[]>([])
  const [recentFlights, setRecentFlights] = useState<number[]>([])

  const keyDownTimesRef = useRef<Map<string, number>>(new Map())
  const lastKeyDownTimeRef = useRef<number | null>(null)
  const dwellHistoryRef = useRef<number[]>([])
  const flightHistoryRef = useRef<number[]>([])
  const totalKeystrokesRef = useRef(0)
  const imposterModeRef = useRef(imposterMode)

  useEffect(() => {
    imposterModeRef.current = imposterMode
  }, [imposterMode])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const now = performance.now()
    keyDownTimesRef.current.set(e.code, now)

    if (lastKeyDownTimeRef.current !== null) {
      const rawFlight = now - lastKeyDownTimeRef.current
      let flightTime = Math.min(rawFlight, 800)

      if (imposterModeRef.current) {
        flightTime = flightTime * (2.5 + Math.random() * 3)
      }

      flightHistoryRef.current = [...flightHistoryRef.current.slice(-MAX_HISTORY), flightTime]
      setRecentFlights([...flightHistoryRef.current.slice(-20)])
    }

    lastKeyDownTimeRef.current = now
  }, [])

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    const downTime = keyDownTimesRef.current.get(e.code)
    if (downTime === undefined) return

    const now = performance.now()
    const rawDwell = now - downTime
    let dwellTime = Math.min(rawDwell, 500)

    if (imposterModeRef.current) {
      dwellTime = dwellTime * (2 + Math.random() * 4)
    }

    keyDownTimesRef.current.delete(e.code)
    dwellHistoryRef.current = [...dwellHistoryRef.current.slice(-MAX_HISTORY), dwellTime]
    totalKeystrokesRef.current += 1

    const totalKs = totalKeystrokesRef.current
    setRecentDwells([...dwellHistoryRef.current.slice(-20)])

    if (totalKs < BASELINE_SAMPLES) {
      setMetrics((prev) => ({
        ...prev,
        dwellTime: Math.round(dwellTime),
        totalKeystrokes: totalKs,
        keystrokesUntilBaseline: BASELINE_SAMPLES - totalKs,
        status: "learning",
        rhythmMatch: 100,
        isAnomaly: false,
      }))
      return
    }

    const baselineDwells = dwellHistoryRef.current.slice(0, BASELINE_SAMPLES)
    const baselineFlights = flightHistoryRef.current.slice(0, BASELINE_SAMPLES)
    const meanDwell = calcMean(baselineDwells)
    const meanFlight = calcMean(baselineFlights)
    const stdDwell = calcStdDev(baselineDwells, meanDwell)
    const stdFlight = calcStdDev(baselineFlights, meanFlight)

    const recentDwellWindow = dwellHistoryRef.current.slice(-5)
    const recentFlightWindow = flightHistoryRef.current.slice(-5)
    const currentDwell = calcMean(recentDwellWindow)
    const currentFlight = calcMean(recentFlightWindow.length > 0 ? recentFlightWindow : [meanFlight])

    const rhythmMatch = Math.round(
      calcRhythmMatch(currentDwell, currentFlight, meanDwell, meanFlight, stdDwell, stdFlight)
    )

    let status: BiometricStatus = "secure"
    if (rhythmMatch < ANOMALY_THRESHOLD) {
      status = "critical"
    } else if (rhythmMatch < CAUTION_THRESHOLD) {
      status = "caution"
    }

    setMetrics({
      dwellTime: Math.round(dwellTime),
      flightTime: Math.round(flightHistoryRef.current[flightHistoryRef.current.length - 1] ?? 0),
      rhythmMatch,
      status,
      isAnomaly: rhythmMatch < ANOMALY_THRESHOLD,
      totalKeystrokes: totalKs,
      keystrokesUntilBaseline: 0,
    })
  }, [])

  const resetMetrics = useCallback(() => {
    keyDownTimesRef.current.clear()
    lastKeyDownTimeRef.current = null
    dwellHistoryRef.current = []
    flightHistoryRef.current = []
    totalKeystrokesRef.current = 0
    setRecentDwells([])
    setRecentFlights([])
    setImposterMode(false)
    setMetrics({
      dwellTime: 0,
      flightTime: 0,
      rhythmMatch: 100,
      status: "idle",
      isAnomaly: false,
      totalKeystrokes: 0,
      keystrokesUntilBaseline: BASELINE_SAMPLES,
    })
  }, [])

  return {
    metrics,
    imposterMode,
    setImposterMode,
    handlers: { onKeyDown, onKeyUp },
    recentDwells,
    recentFlights,
    resetMetrics,
  }
}
