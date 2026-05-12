'use client'

import { RaceData } from "@/constants/race"
import { msToTime } from "@/scripts/time-utility"
import { ChangeEvent, useEffect, useState } from "react"

export type RaceListDisplayProps = {
    races: RaceData[]
}

export type RaceDataDisplayProps = {
    race: RaceData
    selectFunc?: () => void
}

export function RaceListDisplay({ races }: RaceListDisplayProps) {
    const [selectedRace, setSelectedRace] = useState<RaceData | undefined>()
 
    function SelectEditRaceDisplay({race} : RaceDataDisplayProps) {
        const [raceNum, setRaceNum] = useState(race.race_num)
        const [completedTimeArr, setCompletedTime] = useState(race.completed_time_ms)
        const [scheduleTime, setScheduleTime] = useState(race.schedule_timestamp)
        const [teamsArr, setTeams] = useState(race.teams)
        const updatedRace: RaceData = {
            schedule_timestamp: scheduleTime,
            race_num: raceNum,
            completed_time_ms: completedTimeArr,
            teams: teamsArr,
            background_color: race.background_color
        }
        return(
            <div>
                <RaceDataDisplay race={updatedRace}/>
                <p style={{marginTop:"20px", fontSize:"24px", fontWeight:"bold"}}>Edit Below</p>
                <div style={{display:"flex", flexDirection:"column", borderRadius:"5px", padding:"5px", backgroundColor:"#808080"}}>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <p>Race  </p>
                        <input style={{marginLeft: "5px"}} type="number" value={raceNum} onChange={(event) => setRaceNum(parseInt(event.target.value))}/>
                    </div>
                    <input value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)}/>
                    {
                        teamsArr.map((_team, index) => {
                            const handleCompletedTimeChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                                try {
                                    setCompletedTime(completedTimeArr.with(index, event.target.value))
                                } catch (err) {
                                    while (completedTimeArr.length < index + 1) {
                                        completedTimeArr.push('')
                                    }
                                    setCompletedTime(completedTimeArr.with(index, event.target.value))
                                }
                            }

                            return(
                                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}} key={`${raceNum} Team ${index}`}>
                                    <p>Lane {index + 1}</p>
                                    <input type="string" 
                                        defaultValue={teamsArr[index]}
                                        style={{width:"30%"}}
                                        onChange={(event) => {setTeams(teamsArr.with(index, event.target.value))}}/>
                                    <input type="number"
                                            defaultValue={completedTimeArr[index]} 
                                            style={{width:"30%", textAlign:'end'}}
                                            onChange={(event) => {handleCompletedTimeChange(event)}}/>
                                    {
                                        (completedTimeArr[index]) ? <p>(ms)</p> : <></>
                                    }
                                </div>
                                
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:"100%", paddingRight:"20"}}>
            <div style={{display:"flex", flexDirection:'column', gap: 6}}>
                {races.map((race, index) => <RaceDataDisplay race={race} key={index} selectFunc={() => setSelectedRace(race)}/>)}
            </div>
            <div style={{width:"300px"}}>
                {
                    (selectedRace) ? 
                        <SelectEditRaceDisplay race={selectedRace} /> 
                        : 
                        <></> 
                }
            </div>
        </div>
    )
}

export function RaceDataDisplay({ race, selectFunc } : RaceDataDisplayProps) {
    let timeArray = race.completed_time_ms
    return (
        <div style={{ borderRadius: 10, padding: 10, backgroundColor: '#808080' }} 
            onClick={() => selectFunc ? selectFunc() : null}>
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
                    if (timeArray.length > 0 && timeArray[index] && timeArray[index] != '') { // Check if Race has started yet
                        completedTimeOrDNF = timeArray[index] != 'DNF' ? msToTime(timeArray[index]) : 'DNF'
                    } else {
                        completedTimeOrDNF = "TBD" // Yet to Race
                    }
                    return (
                        <div key={race.race_num + ' ' + index} 
                            style={{display:"flex", flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#808080'}}>
                            <p>{team}</p>
                            <p>{completedTimeOrDNF}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}