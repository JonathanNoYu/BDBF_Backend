"use client"; // This is a client component

import { teamData } from "@/constants/user"
import { DocumentData} from "firebase-admin/firestore"
import { useEffect, useState } from "react"
import { thisYear } from "@/constants/dates";
import { db_firestore } from "@/db/firebaseAdmin";

/**
 * Format the data in a useStates
        user/<user_id>/teams Entity Diaagram for firestore
        team: string
        year: string
 * 
 * @returns races
 */
export const useFirestoreUserData = () => {
    const [userTeams, setUserTeams] = useState<teamData[] | undefined>()

    const documentDataToTeam = (docData : DocumentData) : teamData | undefined => {
        let teamName = docData.team
        let year = docData.year
        return {
            team: teamName,
            year: year
        }
    }

    useEffect(() => {
        const q = db_firestore.collection('races')
                    .where("schedule_timestamp", ">=", thisYear)
                    .orderBy("schedule_timestamp", 'desc')
        const unsub = q.onSnapshot((querySnapshot) => {
            let docData = querySnapshot.docs.map((doc) => documentDataToTeam(doc.data)).filter((data) => data != undefined)
            docData = docData.sort((teamA, teamB) => teamA.year.localeCompare(teamB.year))
            setUserTeams([...docData])
        })
        return unsub
    }, [])
    return {
        userTeams,
    }
}