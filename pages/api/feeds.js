import { validateAndExtractRssTitle } from '@/lib/rssUtils';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function handler(req, res) {

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.hashedId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const userAgent = req.headers['user-agent'] || '';
  const acceptHeader = req.headers['accept'] || '';

  if (acceptHeader.includes('text/html') && 
      !req.headers['x-requested-with'] && 
      !req.headers['content-type']) {
    return res.status(400).json({ 
      message: 'Unauthorised' 
    });
  }

  const userId = session.user.hashedId; 

  switch (req.method) {
    case 'GET':
      try {
        const feeds = await prisma.rssFeed.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(feeds);
      } catch (error) {
        console.error('API Error (GET feeds):', error);
        return res.status(500).json({ message: 'Failed to fetch RSS feeds.' });
      }

    case 'POST':
      const { url, title } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'URL is required.' });
      }

      const { isValid: postIsValid, message: postMessage } = await validateAndExtractRssTitle(url);
      if (!postIsValid) {
        return res.status(400).json({ message: `Cannot add feed: ${postMessage}` });
      }

      try {
        const newFeed = await prisma.rssFeed.create({
          data: {
            url,
            title: title || null,
            userId: userId,
          },
        });
        return res.status(201).json(newFeed);
      } catch (error) {
        console.error('API Error (POST feed):', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
          return res.status(409).json({ message: 'This RSS feed URL already exists for this user.' });
        }
        return res.status(500).json({ message: 'Failed to add RSS feed.' });
      }

    case 'DELETE':
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Feed ID is required for deletion.' });
      }
      try {
        const deleteResult = await prisma.rssFeed.deleteMany({
          where: {
            id: id,
            userId: userId,
          },
        });

        if (deleteResult.count === 0) {
          return res.status(404).json({ message: 'RSS feed not found or does not belong to this user.' });
        }

        return res.status(204).end();
      } catch (error) {
        console.error('API Error (DELETE feed):', error);
        return res.status(500).json({ message: 'Failed to delete RSS feed.' });
      }

    case 'PUT':
      const { id: feedId } = req.query;
      const { url: newUrl, title: newTitle } = req.body;

      if (!feedId) {
        return res.status(400).json({ message: 'Feed ID is required for update.' });
      }
      if (!newUrl) {
        return res.status(400).json({ message: 'New URL is required for update.' });
      }

      const { isValid: putIsValid, message: putMessage } = await validateAndExtractRssTitle(newUrl);
      if (!putIsValid) {
        return res.status(400).json({ message: `Cannot update feed: ${putMessage}` });
      }

      try {
        const updatedFeedResult = await prisma.rssFeed.updateMany({
          where: {
            id: feedId,
            userId: userId,
          },
          data: {
            url: newUrl,
            title: newTitle || null,
          },
        });

        if (updatedFeedResult.count === 0) {
          return res.status(404).json({ message: 'RSS feed not found or does not belong to this user.' });
        }

        const fetchedUpdatedFeed = await prisma.rssFeed.findUnique({
            where: { id: feedId }
        });

        return res.status(200).json(fetchedUpdatedFeed);
      } catch (error) {
        console.error('API Error (PUT feed):', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
          return res.status(409).json({ message: 'This RSS feed URL already exists for another feed.' });
        }
        return res.status(500).json({ message: 'Failed to update RSS feed.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}