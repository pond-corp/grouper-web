import clamp from "./clamp"

export default function(score: number): "F" | "D" | "C" | "B" | "A" {
    return "FFFFFFDCBAA"[clamp(score, 0, 100) / 10] as any
}