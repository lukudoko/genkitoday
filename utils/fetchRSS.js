import Parser from 'rss-parser';
import axios from 'axios';
import { setHours, getHours, startOfDay, addDays, isAfter, isBefore } from 'date-fns';
import analyseSentiment from './analyseSentiment';
import shuffleArray from './shuffle';
import {  fromZonedTime, toZonedTime } from 'date-fns-tz'



let parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', {keepArray: true}],
    ]
  }
})

const RSS_FEEDS = [
  { url: "https://www.theguardian.com/europe/rss", source: "The Guardian" },
  { url: "https://www.irishtimes.com/cmlink/the-irish-times-news-1.1319192", source: "The Irish Times"},
  { url: "http://www.reddit.com/r/ireland/.rss", source: "Reddit - r/Ireland" },
  { url: "http://fetchrss.com/rss/669ff6d792b614031b0a16c4669ff6731d7f84a4bb02f263.atom", source: "RTE"},
  { url: "https://japantimes.co.jp/feed", source: "Japan Times" },
  { url: "https://mainichi.jp/rss/etc/english_latest.rss", source: "The Mainichi Shimbun"},
  { url: "https://www.thejournal.ie/feed/", source: "The Journal" },
  //{ url: "https://www.euronews.com/rss", source: "Euronews"},
  { url: "https://japantoday.com/feed/atom", source: "Japan Today"},
  { url: "https://news.google.com/rss/search?q=+site:www3.nhk.or.jp/nhkworld/&hl=en-US&gl=US&ceid=US:en", source: "NHK World"},
];


const gnow = new Date();
const tzone = 'Europe/Stockholm';

export function getPreviousChunkTimes() {
  const now = toZonedTime(gnow, tzone);
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
  
    chunkEndTime = fromZonedTime(chunkEndTime, tzone).toISOString();
    chunkStartTime = fromZonedTime(chunkStartTime, tzone).toISOString();

  return { chunkStartTime, chunkEndTime };
}


async function fetchRSS() {
  let allItems = [];
  const { chunkStartTime, chunkEndTime } = getPreviousChunkTimes();


  for (const { url, source } of RSS_FEEDS) {
    try {
      // Fetch the raw RSS feed
      const response = await axios.get(url);
      let data = response.data;

      // Clean the data by removing any leading non-whitespace characters
      data = data.trim();


      // Parse the cleaned data
      const feed = await parser.parseString(data);


      // Filter out items outside the previous chunk
      const recentItems = feed.items.filter(item => {
        const pubDate = new Date(item.isoDate || item.pubDate);

        return isAfter(pubDate, chunkStartTime) && isBefore(pubDate, chunkEndTime);
      });

      // Analyze sentiment for each item and filter out those with negative sentiment
      recentItems.forEach(item => {
        const { score, sentiment } = analyseSentiment(item.title);
        item.sentimentScore = score;
        item.sentimentLabel = sentiment;
        item.source = source; // Add source to item

        if (item['media:content'] && item['media:content'].length > 0) {
          item.imageUrls = item['media:content'].map(media => media['$']?.url).filter(url => url);
        } else {
          item.imageUrls = null;
        }
      });

      // Filter out items with a sentiment score below -0.1
      const filteredItems = recentItems.filter(item => item.sentimentScore >= -0.1);

      allItems = [...allItems, ...filteredItems];
    } catch (error) {
      console.error(`Failed to fetch or parse feed from ${url}:`, error);
    }
  }

  // Shuffle the items before returning
  const shuffledItems = shuffleArray(allItems);

  return shuffledItems;
}

export default fetchRSS;
