import { parseISO, isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, addDays, subDays } from 'date-fns';

export const getLastTimeChunk = () => {
  const now = new Date();

  const hour = now.getHours();

  if (hour < 9) {
    return 'night'; 
  } else if (hour < 15) {
    return 'morning'; 
  } else if (hour < 21) {
    return 'afternoon'; 
  } else {
    return 'afternoon'; 
  }
};

export const getLastChunkInterval = () => {
  const now = new Date();
  const hour = now.getHours();

  let start, end;

  if (hour < 9) {

    start = setHours(setMinutes(setSeconds(setMilliseconds(subDays(now, 1), 0), 0), 0), 21); 
    end = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 9); 
  } else if (hour < 15) {

    start = setHours(setMinutes(setSeconds(setMilliseconds(subDays(now, 1), 0), 0), 0), 21); 
    end = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 9); 
  } else if (hour < 21) {

    start = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 9); 
    end = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 15); 
  } else {

    start = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 15); 
    end = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 21); 
  }

  return { start, end };
};

export const filterArticlesByLastChunk = (articles) => {
  const { start, end } = getLastChunkInterval();

  return articles.filter(article => {
    const articleTime = parseISO(article.publishedAt); 
    return isWithinInterval(articleTime, { start, end });
  });
};

export const getNextChunkStartTime = () => {
  const now = new Date();
  const hour = now.getHours();

  let nextChunkStart;

  if (hour < 9) {

    nextChunkStart = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 9);
  } else if (hour < 15) {

    nextChunkStart = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 15);
  } else if (hour < 21) {

    nextChunkStart = setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 21);
  } else {

    nextChunkStart = setHours(setMinutes(setSeconds(setMilliseconds(addDays(now, 1), 0), 0), 0), 9);
  }

  return nextChunkStart;
};