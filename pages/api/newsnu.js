import Parser from 'rss-parser';
import analyseSentiment from '@/utils/sentiment';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
    ],
  },
});

const extractImages = (item) => {
  if (item['media:content'] && item['media:content'].length > 0) {
    if (item['media:content'].length > 1) {
      return [item['media:content'][item['media:content'].length - 1]['$']?.url].filter((url) => url !== undefined);
    }
    return [item['media:content'][0]['$']?.url].filter((url) => url !== undefined);
  }
  return [];
};

const normalizeDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    console.error(`Failed to parse date: ${dateString}`, error);
  }
  return null;
};

export default async function handler(req, res) {
  // 1. Always check session authentication first
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.hashedId) {
    return res.status(401).json({ message: 'Authentication required to fetch news feeds.' });
  }

  // 2. Add check to discourage direct browser access
  const userAgent = req.headers['user-agent'] || '';
  const acceptHeader = req.headers['accept'] || '';
  
  // If it looks like someone manually entered the URL in browser address bar
  if (acceptHeader.includes('text/html') && 
      !req.headers['x-requested-with'] && 
      !req.headers['content-type']) {
    return res.status(400).json({ 
      message: 'Unauthorised' 
    });
  }

  const userId = session.user.hashedId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { sentimentScore: true }
    });

    const sentimentThreshold = user?.sentimentScore ?? -0.1;

    let allArticles = [];
    const dbRssFeeds = await prisma.rssFeed.findMany({
      where: { userId: userId },
    });

    const normalizedRssFeeds = dbRssFeeds.map(dbFeed => ({
      url: dbFeed.url,
      source: dbFeed.title || dbFeed.url,
    }));

    const feedPromises = normalizedRssFeeds.map(async ({ url, source }) => {
      try {
        const parsedFeed = await parser.parseURL(url);
        return parsedFeed.items.map((item) => ({
          title: item.title,
          link: item.link,
          publishedAt: normalizeDate(item.pubDate),
          source,
          imageUrls: extractImages(item),
          sentimentAnalysis: analyseSentiment(item.title),
          contentSnippet: item.contentSnippet || item.description || '',
        }));
      } catch (error) {
        console.error(`Failed to fetch or parse feed: ${url} (Source: ${source})`, error);
        return [];
      }
    });

    const allFeeds = await Promise.all(feedPromises);
    allArticles = allFeeds.flat();

    const validArticles = allArticles.filter(article =>
      article.publishedAt && article.sentimentAnalysis.score >= sentimentThreshold
    );

    res.status(200).json({
      success: true,
      articles: validArticles,
    });
  } catch (error) {
    console.error('Error fetching RSS feeds from database or processing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RSS feeds or process articles.',
      error: error.message,
    });
  }
}