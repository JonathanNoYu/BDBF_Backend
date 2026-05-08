export type RaceData = { 
    schedule_timestamp: string; 
    race_num: number; 
    completed_time_ms: string[]; 
    teams: string[]
    background_color: string
}

/**
 * Returns true if r1 (RaceData) equals r2 (RaceData) in it's entirety. 
 * All properties and arrays are equal
 * 
 * @param r1 RaceData
 * @param r2 RaceData
 * @returns True or False if the two races are equal
 */
export function raceEqualRace(r1: RaceData, r2: RaceData): boolean {
    return (r1.schedule_timestamp == r2.schedule_timestamp) 
        && (r1.background_color == r2.background_color)
        && (r1.race_num == r2.race_num)
        && (r1.teams.reduce((acc, curr, ind) => {
            return acc && curr == r2.teams[ind]
        }, true))
}

/**
 * Returns index of a race in a race array. If the race is not in the array it returns -1
 * 
 * @param r RaceData
 * @param rl RaceData[]
 * @returns Index of the race in the array or -1
 */
export function raceIndexInRaceArr(r: RaceData, rl: RaceData[]): Number {
    for(let i = 0; i < rl.length; i++) {
        if (raceEqualRace(r, rl[i])) {
            return i
        }
    }
    return -1
}