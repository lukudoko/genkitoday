import { validateAndExtractRssTitle } from '@/lib/rssUtils'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
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

  const { url } = req.query; 

  if (!url) {
    return res.status(400).json({ message: 'URL parameter is required.' });
  }

  const { isValid, title, message } = await validateAndExtractRssTitle(url);

  if (isValid) {
    return res.status(200).json({ title: title || '' }); 
  } else {

    return res.status(400).json({ message: message || 'Failed to validate RSS feed URL.' });
  }
}