import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import prisma from "@/lib/prisma"; 

export default async function handler(req, res) {

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
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

  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in session' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { sentimentScore: true }
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ 
          sentimentThreshold: user.sentimentScore ?? -0.1 
        });
      } catch (error) {
        console.error('Error fetching sentiment score:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'PUT':
      try {
        const { sentimentThreshold } = req.body;

        if (typeof sentimentThreshold !== 'number' || 
            sentimentThreshold < -0.85 || 
            sentimentThreshold > 0.75) {
          return res.status(400).json({ 
            message: 'Invalid sentiment threshold. Must be between -0.85 and 0.75' 
          });
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { sentimentScore: sentimentThreshold }
        });

        return res.status(200).json({ 
          message: 'Sentiment threshold updated successfully',
          sentimentThreshold: updatedUser.sentimentScore
        });
      } catch (error) {
        console.error('Error updating sentiment score:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}