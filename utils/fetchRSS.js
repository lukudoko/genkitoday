// fetchRSS.js
import Parser from 'rss-parser';
import axios from 'axios';
import analyseSentiment from './analyseSentiment';
import shuffleArray from './shuffle';

let parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
    ],
  },
});

const RSS_FEEDS = [
  { url: "https://www.theguardian.com/europe/rss", source: "The Guardian" },
  { url: "https://www.irishtimes.com/cmlink/the-irish-times-news-1.1319192", source: "The Irish Times" },
  { url: "http://www.reddit.com/r/ireland/.rss", source: "Reddit - r/Ireland" },
  { url: "http://fetchrss.com/rss/669ff6d792b614031b0a16c4669ff6731d7f84a4bb02f263.atom", source: "RTE" },
  { url: "https://japantimes.co.jp/feed", source: "Japan Times" },
  { url: "https://mainichi.jp/rss/etc/english_latest.rss", source: "The Mainichi Shimbun" },
  { url: "https://www.thejournal.ie/feed/", source: "The Journal" },
  { url: "https://japantoday.com/feed/atom", source: "Japan Today" },
  { url: "https://news.google.com/rss/search?q=+site:www3.nhk.or.jp/nhkworld/&hl=en-US&gl=US&ceid=US:en", source: "NHK World" },
];

async function fetchRSS() {
  let allItems = [];

  for (const { url, source } of RSS_FEEDS) {
    try {
      // Fetch the raw RSS feed
      const response = await axios.get(url);
      let data = response.data;

      // Clean the data by removing any leading non-whitespace characters
      data = data.trim();

      // Parse the cleaned data
      const feed = await parser.parseString(data);

      // Analyze sentiment for each item and add source
      feed.items.forEach(item => {
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
      const filteredItems = feed.items.filter(item => item.sentimentScore >= -0.1);

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
