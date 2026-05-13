'use server'

import { RaceData, raceEqualRace } from "@/constants/race"
import { db_firestore } from "@/db/firebaseAdmin"
import { Timestamp } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"

export const handleUpdateList = async (race: RaceData, updatedRace: RaceData, formData: FormData) => {
    if (raceEqualRace(race, updatedRace)) {
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
        race = updatedRace
        revalidatePath(`/`);
    } catch (err) {
        console.log(err)
    }    
}