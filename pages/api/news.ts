import Parser from 'rss-parser';
import analyseSentiment from '@/utils/sentiment';

const parser: Parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
    ],
  },
});

interface RSSFeed {
  url: string;
  source: string;
}

const RSS_FEEDS: RSSFeed[] = [
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
  { url: "https://www.scmp.com/rss/5/feed", source: "South China Morning Post" },
  { url: "https://www.politico.eu/feed/", source: "Politico Europe" },
];

interface ExtractedImage {
  url: string;
}

const extractImages = (item: any): string[] => {
  if (item['media:content'] && item['media:content'].length > 0) {
    if (item['media:content'].length > 1) {
      return [item['media:content'][item['media:content'].length - 1]['$']?.url].filter((url: string | undefined) => url !== undefined);
    }
    return [item['media:content'][0]['$']?.url].filter((url: string | undefined) => url !== undefined);
  }
  return [];
};

const normalizeDate = (dateString: string): string | null => {
  try {
    const date: Date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    console.error(`Failed to parse date: ${dateString}`, error);
  }
  return null;
};

interface Article {
  title: string;
  link: string;
  publishedAt: string | null;
  source: string;
  imageUrls: string[];
  sentimentAnalysis: { score: number; label: string };
  contentSnippet: string;
}

export default async function handler(req: any, res: any): Promise<void> {
  // Get the API key from the request header
  const clientApiKey = req.headers['x-api-key'];

  // Get the API key stored in the .env file
  const storedApiKey = process.env.API_KEY;

  // If the API key doesn't match, respond with a 403 Forbidden error
  if (clientApiKey !== storedApiKey) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }

  try {
    let allArticles: Article[] = [];

    const feedPromises = RSS_FEEDS.map(async ({ url, source }: RSSFeed) => {
      try {
        const parsedFeed: any = await parser.parseURL(url);
        return parsedFeed.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          publishedAt: normalizeDate(item.pubDate),
          source,
          imageUrls: extractImages(item),
          sentimentAnalysis: analyseSentiment(item.title),
          contentSnippet: item.contentSnippet || item.description || '', 
        }));
      } catch (error) {
        console.error(`Failed to fetch or parse feed: ${url}`, error);
        return [];
      }
    });

    const allFeeds: Article[][] = await Promise.all(feedPromises);
    allArticles = allFeeds.flat();

    const validArticles = allArticles.filter(article => article.publishedAt && article.sentimentAnalysis.score >= -0.1);

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
