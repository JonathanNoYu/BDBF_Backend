import { MILLISECOND_PER_SECOND, MINUTES_PER_HOURS, SECONDS_PER_MINUTE } from "@/constants/time-dates";

/**
 * 
 * Turns a duration in milliseconds into a string of HH:MM:SS format
 * 
 * @param {string} duration - integer number in milliseconds 
 * @returns string in HH:MM:SS format
 */
export function msToTime(duration) {
    if (duration < 100) {
        return '00:00.0'
    }

    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) && hours !== '00' ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds

    if (hours !== '00') {
      return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }
    
    return minutes + ":" + seconds + "." + milliseconds;
}

/**
 * 
 * Assumes time is in formate HH:MM:SS returns the time in milliseconds
 * 
 * @param {string} time 
 * returns number/integer in milliseconds
 */
export function timeToMS (time) {
    timeArr = time.split(':')
    return (timeArr[0] * MILLISECOND_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOURS) 
         + (timeArr[1] * MILLISECOND_PER_SECOND * SECONDS_PER_MINUTE) 
         + (timeArr[2] * MILLISECOND_PER_SECOND)
}