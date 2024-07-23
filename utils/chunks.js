import { setHours, getHours, startOfDay, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'

const now = new Date();


export function getPreviousChunkTimes() {

  const hour = getHours(now);
  let chunkStartTime, chunkEndTime;

  if (hour >= 21 || hour < 9) {
    chunkEndTime = setHours(startOfDay(now), 21);
    chunkStartTime = setHours(startOfDay(now), 15);
    if (hour < 9) {
      chunkEndTime = addDays(chunkEndTime, -1);
      chunkStartTime = addDays(chunkStartTime, -1);
    }
  } else if (hour >= 9 && hour < 15) {
    chunkEndTime = setHours(startOfDay(now), 9);
    chunkStartTime = setHours(startOfDay(now), 21);
    chunkStartTime = addDays(chunkStartTime, -1);
  } else {
    chunkEndTime = setHours(startOfDay(now), 15);
    chunkStartTime = setHours(startOfDay(now), 9);
  }

  // Ensure minutes and seconds are set to 0
  chunkStartTime = formatInTimeZone(chunkStartTime, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX');
  chunkEndTime = formatInTimeZone(chunkEndTime, 'Europe/Stockholm', 'yyyy-MM-dd HH:mm:ssXXX');


  return { chunkStartTime, chunkEndTime };
}



export function getCurrentChunkEndTime() {

        const hour = getHours(now);
        let nextChunk;
      
        if (hour >= 21 || hour < 9) {
            nextChunk = setHours(startOfDay(now), 9);
            nextChunk = addDays(nextChunk, 1);
            if (hour < 9) {
              nextChunk = setHours(startOfDay(now), 9);
            }
        } else if (hour >= 9 && hour < 15) {
            nextChunk = setHours(startOfDay(now), 15);//15
        } else {
            nextChunk = setHours(startOfDay(now), 21);
        }
      
        // Ensure minutes and seconds are set to 0
         nextChunk = new Date(nextChunk);
      
        return { nextChunk };
      }