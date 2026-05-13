import { RaceListDisplay } from "@/components/race-data-display";
import { RaceData } from "@/constants/race";
import { db_firestore } from "@/db/firebaseAdmin";
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
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left w-full">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Race Data
          </h1>
          <RaceListDisplay races={races}/>
        </div>
      </main>
    </div>
  );
}
