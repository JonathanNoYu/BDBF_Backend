'use client'

import { RaceData, raceEqualRace } from "@/constants/race"
import { msToTime } from "@/scripts/time-utility"
import { ChangeEvent, useEffect, useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { handleUpdateList } from "./update-race-list"

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
        const [disableSubmit, setDisableSubmit] = useState(false)
        const updatedRace: RaceData = {
            id: race.id,
            schedule_timestamp: scheduleTime,
            race_num: raceNum,
            completed_time_ms: completedTimeArr,
            teams: teamsArr,
            background_color: race.background_color
        }
        let scheduleTimeAsDate = new Date(scheduleTime)
        useEffect(() => {
            scheduleTimeAsDate = new Date(scheduleTime)
            if (scheduleTimeAsDate.toString() == 'Invalid Date') {
                toast.error('Schedule Date is invalid, make sure it has time in "MM/DD/YY HH:MM" form', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                    onOpen: () => {setDisableSubmit(true)}
                })
            } else {
                toast.dismiss()
                setDisableSubmit(false)
                // Disable update button if there is nothing to update
                if (raceEqualRace(race, updatedRace)) {
                    setDisableSubmit(true)
                } else {
                    setDisableSubmit(false)
                }
            }
            toast.clearWaitingQueue();
        }, [scheduleTime, updatedRace])

        const submitRaceForm = handleUpdateList.bind(null, race, updatedRace)

        return(
            <div>
                <ToastContainer limit={1}/>
                <p style={{marginTop:"-36.5px", fontSize:"24px", fontWeight:"bold"}}>Selected Race</p>
                <RaceDataDisplay race={updatedRace}/>
                <p style={{marginTop:"20px", fontSize:"24px", fontWeight:"bold"}}>Edit Below</p>
                <form style={{display:"flex", flexDirection:"column", borderRadius:"5px", padding:"5px", backgroundColor:"#808080"}}
                    action={submitRaceForm}>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <p>Race  </p>
                        <input style={{marginLeft: "5px", border:`1px solid #000000`, borderRadius:'5px', paddingLeft:'5px'}} type="number" value={raceNum} onChange={(event) => setRaceNum(parseInt(event.target.value))}/>
                    </div>
                    <input style={{border:`1px solid #000000`, borderRadius:'5px', paddingLeft:'5px', marginTop:"5px"}} value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)}/>
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
                                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"5px"}} key={`${raceNum} Team ${index}`}>
                                    <p>Lane {index + 1}</p>
                                    <input type="string" 
                                        defaultValue={teamsArr[index]}
                                        style={{width:"30%",border:`1px solid #000000`, borderRadius:'5px', paddingLeft:'5px'}}
                                        onChange={(event) => {setTeams(teamsArr.with(index, event.target.value))}}/>
                                    <input type="number"
                                            defaultValue={completedTimeArr[index]} 
                                            style={{width:"30%", textAlign:'end', borderRadius:'5px', paddingLeft:'5px', border: `1px solid #000000`}}
                                            onChange={(event) => {handleCompletedTimeChange(event)}}/>
                                    <p>(ms)</p>
                                </div>
                            )
                        })
                    }
                    <button style={{borderRadius: "5px", backgroundColor: `#00AA00`, padding: '8.5px', marginTop:"10px"}} disabled={disableSubmit}>Update Live List</button>
                </form>
            </div>
        )
    }

    return (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:"100%", paddingRight:"20"}}>
            <div style={{display:"flex", flexDirection:'column', gap: 6}}>
                {races.map((race, index) => <RaceDataDisplay race={race} key={index} selectFunc={() => setSelectedRace(race)}/>)}
            </div>
            <div style={{maxWidth:"300px"}}>
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
        <div style={{ borderRadius: 10, padding: 10, backgroundColor: '#808080', cursor:'pointer' }} 
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