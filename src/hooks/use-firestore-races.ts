"use client"; // This is a client component

import { thisYear } from "@/constants/dates"
import { RaceData } from "@/constants/race"
import { db_firestore } from "@/db/firebaseAdmin";
import { DocumentData, Timestamp } from "firebase-admin/firestore"
import { useEffect, useState } from "react"

/**
 * 
 * Assume if there is no entries in completed_time_ms Array the race is only scheduled
 * if there is any entry in completed_time_ms array the race is complete and in order of completion
 * missing entries is DNF.
 * 
 * Format the data in a useStates
    Race Entity Diaagram for firestore
        race_num:             Int64
        teams:                <Array<String>>
        scheduled_timestampe: <timestamp>
        completed_time_ms:    <Array<Int64>>

        completed_time_ms is in the same order as team i.e. 
        teams: ["team1", "team2"]
        completed_time_ms: [150000, 138000]
        means: team1 completed the race in 150000 milliseconds, team2 in 1380000 milliseconds
 * 
 * @returns races
 */
export const useFirestoreRaces = async () => {
    const [races, setRaces] = useState<RaceData[]>([])

    const documentDataToRaceData = (docData: DocumentData): RaceData | undefined => {
        let scheduleTimestamp = new Timestamp(docData?.schedule_timestamp.seconds, docData?.schedule_timestamp.nanoseconds).toDate().toLocaleString(undefined, {
                year: '2-digit',
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
        })
        let raceNum: number = docData?.race_num
        let timeArray: string[] = docData?.completed_time_ms
        let teamArray: string[] = docData?.teams
        let raceColor = (timeArray && timeArray.length == 0) ? "#9e9156" : "#49b42e"
        return {
            schedule_timestamp: scheduleTimestamp,
            race_num: raceNum,
            completed_time_ms: timeArray,
            teams: teamArray,
            background_color: raceColor
        }
    }

    /**
     * returns next uncompleted race from firestore otherwise it returns null (i.e. returns null if all races are completed)
     * 
     * @returns 
     */
    const nextUpcomingRace = (teamName: (string | undefined) = undefined): RaceData | undefined => {
        for (let i = 0; i < races.length; i++) {
            let timeArray = races[i].completed_time_ms
            if (timeArray && timeArray.length != 0) {
                let nextRace
                // Checks that index is not out of bounds and if teamname exists check if it is in the nextRace teams array.
                while (i > 0) {
                    i = i - 1
                    console.log(i)
                    nextRace = races[i]
                    if (!teamName || nextRace.teams.includes(teamName)) {
                        return nextRace
                    }
                }
                return undefined
            }
        }
        return undefined
    }

    // useEffect(() => {
    //     const q = db_firestore.collection('races')
    //         .where("schedule_timestamp", ">=", thisYear)
    //         .orderBy("schedule_timestamp", 'desc')
    //     const unsub = q.onSnapshot((querySnapshot) => {
    //       let allRaces = querySnapshot.docs.map((doc) => documentDataToRaceData(doc.data()))
    //       let noUndefinedRaces = allRaces.filter((race) => race != undefined)
    //       setRaces([...noUndefinedRaces])
    //       })
    //     return unsub
    //     }, [])

    const snapshot = await db_firestore.collection('races').get()
    const raceData = snapshot.docs.map((doc) => documentDataToRaceData(doc.data()))
    let noUndefinedRaces = raceData.filter((race) => race != undefined)
    setRaces([...noUndefinedRaces])
    return {
        races, 
        nextUpcomingRace,
    }
}