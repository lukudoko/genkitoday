import Parser from 'rss-parser';
import analyseSentiment from '@/utils/sentiment'; // Assuming you've integrated sentiment analysis

const parser = new Parser({
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
  { url: "https://www.rte.ie/feeds/rss/?index=/news/&limit=100", source: "RTE" },
  { url: "https://japantimes.co.jp/feed", source: "Japan Times" },
  { url: "https://mainichi.jp/rss/etc/english_latest.rss", source: "The Mainichi Shimbun" },
  { url: "https://www.thejournal.ie/feed/", source: "The Journal" },
  { url: "https://japantoday.com/feed/atom", source: "Japan Today" },
  { url: "https://www.lemonde.fr/en/rss/une.xml", source: "Le Monde" },
  { url: "https://feeds.feedburner.com/euronews/en/home/", source: "Euronews" },
];

const extractImages = (item) => {
  if (item['media:content'] && item['media:content'].length > 0) {
    // If there's more than one image, take the last one (usually the largest)
    if (item['media:content'].length > 1) {
      return [item['media:content'][item['media:content'].length - 1]['$']?.url].filter(url => url);
    }
    // If only one image is present, return it
    return [item['media:content'][0]['$']?.url].filter(url => url);
  }
  return [];
};

// Helper function to normalize dates
const normalizeDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString(); // Normalize to ISO 8601 format
    }
  } catch (error) {
    console.error(`Failed to parse date: ${dateString}`, error);
  }
  return null; // Return null if parsing fails
};

export default async function handler(req, res) {
  try {
    let allArticles = [];

    // Fetch and parse articles from each feed concurrently
    const feedPromises = RSS_FEEDS.map(async ({ url, source }) => {
      try {
        const parsedFeed = await parser.parseURL(url);
        // Add source and extract images for each item
        return parsedFeed.items.map(item => ({
          title: item.title,
          link: item.link,
          publishedAt: normalizeDate(item.pubDate), // Normalize date
          source, // Add source information
          imageUrls: extractImages(item), // Add extracted image URLs
          sentimentAnalysis: analyseSentiment(item.title), // Get sentiment score and label
        }));
      } catch (error) {
        console.error(`Failed to fetch or parse feed: ${url}`, error);
        return []; // Return empty array on failure
      }
    });

    // Resolve all feed promises
    const allFeeds = await Promise.all(feedPromises);

    // Flatten the results into a single array
    allArticles = allFeeds.flat();

    // Filter out articles with invalid dates or negative sentiment
    const validArticles = allArticles
      .filter(article => article.publishedAt && article.sentimentAnalysis.score >= -0.1); 

    res.status(200).json({
      success: true,
      articles: validArticles,
    });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RSS feeds.',
      error: error.message,
    });
  }
}
