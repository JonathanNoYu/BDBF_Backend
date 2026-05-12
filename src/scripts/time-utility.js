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
