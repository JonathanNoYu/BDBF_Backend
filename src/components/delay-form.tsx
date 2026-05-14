'use client'

import { RaceData } from "@/constants/race"
import { MILLISECOND_PER_SECOND, MINUTES_PER_HOURS, SECONDS_PER_MINUTE } from "@/constants/time-dates"
import { timeToMS } from "@/scripts/time-utility"
import { handleUpdateRacesWithDelay } from "@/scripts/update-races"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"

type DelayFormProps = {
    races: RaceData[]
}

export function DelayForm({races}: DelayFormProps) {
    const [disableButton, setDisableButton] = useState(false)
    const [hrs, setHrs] = useState(0)
    const [min, setMin] = useState(0)
    const [sec, setSec] = useState(0)
    const [millSecDelay, setMillSecDelay] = useState(0)

    useEffect(() => {
        setMillSecDelay(timeToMS(`${hrs}:${min}:${sec}`))
        console.log(`${hrs}:${min}:${sec}`)
        // disable or enable delay button if delay is over or equal to 1 min
        if (millSecDelay < MILLISECOND_PER_SECOND * SECONDS_PER_MINUTE) { 
            setDisableButton(true)
        } else {
            setDisableButton(false)
        } 
    }, [hrs, min, sec])

    

    const parseIntTry = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>, setFunc: Dispatch<SetStateAction<number>>) => {
        try {
            event.preventDefault()
            if (event.target.value && event.target.value != '') {
                setFunc(parseInt(event.target.value))
            } else {
                setFunc(0)
            }
        } catch (err) {
            console.log('Error in parseIntTry', err)
        }
    }

    const handleDelay = handleUpdateRacesWithDelay.bind(null, races, millSecDelay) 

    return(
        <form className="flex flex-row bg-gray-800 rounded-md p-2 mx-2 mb-5 w-full items-center justify-between" 
            action={handleDelay}>
            <p className="block text-sm font-medium">
                Set Delay (HH:MM:SS)
            </p>
            <div className="flex flex-row item-center border-1 border-black rounded-md mr-5">
                <input className="display-none rounded-md border-black delay-input text-end" 
                        style={{maxWidth: '22px'}}
                        name="delay-hour" type='number' defaultValue={0} max={24} min={0}
                        onChange={event => parseIntTry(event, setHrs)}
                        onSubmit={e => e.preventDefault}/>
                <p>:</p>
                <input className="rounded-md border-black delay-input text-end" 
                        style={{maxWidth: '22px'}}
                        name="delay-minutes" type='number' defaultValue={0} max={60} min={0}
                        onChange={event => parseIntTry(event, setMin)}
                        onSubmit={e => e.preventDefault}/>
                <p>:</p>
                <input className="rounded-md border-black delay-input mr-1 text-end" 
                        style={{maxWidth: '22px'}}
                        name="delay-seconds" type='number' defaultValue={0} max={60} min={0}
                        onChange={event => parseIntTry(event, setSec)}
                        onSubmit={e => e.preventDefault}/>
            </div>
            <button className="submit-button submit-delay" type="submit" disabled={disableButton}>Add Delay</button>
        </form>
    )
}