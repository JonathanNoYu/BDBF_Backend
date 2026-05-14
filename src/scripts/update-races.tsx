'use server'

import { RaceData, raceEqualRace } from "@/constants/race"
import { MILLISECOND_PER_CENTISECOND, MILLISECOND_PER_SECOND, SECONDS_PER_MINUTE } from "@/constants/time-dates"
import { db_firestore } from "@/db/firebaseAdmin"
import { Timestamp } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"

export const handleAddRace = async (race: RaceData) => {
    try {
        const res = await db_firestore.collection('races').add(race)
        revalidatePath(`/`);
    } catch (err) {
        console.log(err)
    }    
}

export const handleUpdateRace = async (pastRace: RaceData, updatedRace: RaceData) => {
    if (raceEqualRace(pastRace, updatedRace)) {
        console.log('Nothing to Update')
        return
    }
    const updatedData = {
        race_num: updatedRace.race_num,
        schedule_timestamp: Timestamp.fromDate(new Date(updatedRace.schedule_timestamp)),
        completed_time_ms: updatedRace.completed_time_ms,
        teams: updatedRace.teams
    }
    try {
        const res = await db_firestore.collection('races').doc(updatedRace.id).set(updatedData)
        pastRace = updatedRace
        revalidatePath(`/`);
    } catch (err) {
        console.log(err)
    }    
}

export const handleUpdateRacesWithDelay = async (races: RaceData[], delayMillSec:number) => {
    let startingDate = new Date('4/12/26, 7:22 PM')
    console.log(delayMillSec)
    // Runs only if delay is more than a minute
    for (let idx = 0; idx < races.length && delayMillSec >= (MILLISECOND_PER_SECOND * SECONDS_PER_MINUTE); idx++) {
        let thisRace = races[idx]
        let scheduleDate = new Date(thisRace.schedule_timestamp)
        // Schedule Date is valid and in the future compared to starting date
        if (scheduleDate.toString() != 'Invalid Date' && (+scheduleDate >= +startingDate)) {
            let newScheduleDate = new Date(scheduleDate.getTime() + delayMillSec)
            const updatedData = {
                race_num: thisRace.race_num,
                schedule_timestamp: Timestamp.fromDate(newScheduleDate),
                completed_time_ms: thisRace.completed_time_ms,
                teams: thisRace.teams
            }
            try {
                const res = await db_firestore.collection('races').doc(thisRace.id).set(updatedData)
                thisRace = {...thisRace, schedule_timestamp: newScheduleDate.toLocaleString(undefined, {
                    year: '2-digit',
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                })}
            } catch (err) {
                console.log(err)
            }
        }
    }
    revalidatePath(`/`);
}