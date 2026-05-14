import { DelayForm } from "@/components/delay-form";
import { RaceListDisplay } from "@/components/race-data-display";
import { RaceData } from "@/constants/race";
import { db_firestore } from "@/db/firebaseAdmin";
import { handleUpdateRacesWithDelay } from "@/scripts/update-races";
import { DocumentData, Timestamp } from "firebase-admin/firestore";

const documentDataToRaceData = (docData: DocumentData, docId: string): RaceData | undefined => {
    try {
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
            id: docId,
            schedule_timestamp: scheduleTimestamp,
            race_num: raceNum,
            completed_time_ms: timeArray,
            teams: teamArray,
            background_color: raceColor
        }
    } catch (err) {
        return
    }
}

async function loadRaces(): Promise<RaceData[]> {
    const snapshot = await db_firestore.collection('races').get()
    const raceData = snapshot.docs.map((doc) => documentDataToRaceData(doc.data(), doc.id))
    let noUndefinedRaces = raceData.filter((race) => race != undefined)
    return noUndefinedRaces
}

export default async function Home() {
  const races = await loadRaces()

  const handleDelay = handleUpdateRacesWithDelay.bind(null, races) 

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-80 flex-col items-center justify-between py-8 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-row items-center text-center sm:items-start sm:text-left w-full">
          <RaceListDisplay races={races}>
            <DelayForm races={races} />
          </RaceListDisplay>
        </div>
      </main>
    </div>
  );
}
