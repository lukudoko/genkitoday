import fetchRSS from '@/utils/fetchRSS';

export default async (req, res) => {
  try {
    const newsItems = await fetchRSS(); // Fetch RSS feeds
    res.status(200).json({ news: newsItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ news: [], error: 'Failed to fetch news' });
  }
};
