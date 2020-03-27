export const seconds = (s: number) => s * 1000
export const minutes = (m: number) => seconds(m * 60)
export const hours = (h: number) => minutes(h * 60)
export const days = (d: number) => hours(d * 24)
export const weeks = (w: number) => days(w * 7)
export const months = (mo: number) => days(mo * 30)

const timingLookup = [
    0,          // 0, not used
    hours(4),   // 1
    hours(8),   // 2
    days(1),    // 3
    days(2),    // 4
    days(4),    // 5
    weeks(2),   // 6
    months(1),  // 7
    months(4),  // 8
    Infinity    // 9 / Graduated
]

// The SRS timing function
export function getTimeFromLevel(level: number) {
    return timingLookup[level]
}