'use client'

import { RaceData } from "@/constants/race"
import { msToTime } from "@/scripts/time-utility"
import { useState } from "react"

export type RaceListDisplayProps = {
    races: RaceData[]
}

export type RaceDataDisplayProps = {
    race: RaceData
}

export function RaceListDisplay({ races }: RaceListDisplayProps) {
    const [selectedRace, setSelectedRace] = useState<RaceData | undefined>()
    return (
        <div style={{display:"flex"}}>
            <div style={{display:"flex", flexDirection:'column', gap: 6}}>
                {races.map((race, index) => <RaceDataDisplay race={race} key={index}/>)}
            </div>
            <div >
                
            </div>
        </div>
    )
}

export function RaceDataDisplay({ race } : RaceDataDisplayProps) {
    let timeArray = race.completed_time_ms
    return (
        <div style={{ borderRadius: 10, padding: 10, backgroundColor: '#808080' }}>
            <div style={{ display:"flex", 
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 2,
                paddingRight: 2,
                borderRadius: 2, backgroundColor: race.background_color }}>
                <p style={{paddingRight: 20}}>Race {race.race_num}     </p>
                <p>{race.schedule_timestamp}</p>
            </div>
            {
                race.teams.map((team, index: number) => {
                    let completedTimeOrDNF;
                    if (timeArray.length > 0) { // Check if Race has started yet
                        completedTimeOrDNF = timeArray[index] && timeArray[index] != 'DNF' ? msToTime(timeArray[index]) : 'DNF'
                    } else {
                        completedTimeOrDNF = "TBD" // Yet to Race
                    }
                    return (
                        <div key={race.race_num + ' ' + index} style={{display:"flex", flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#808080'}}>
                            <p>{team}</p>
                            <p>{completedTimeOrDNF}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}