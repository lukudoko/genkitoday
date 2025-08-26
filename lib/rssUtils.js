import Parser from 'rss-parser';

const parser = new Parser();

/**
 * Validates if a given URL points to a valid RSS/Atom feed and attempts to extract its title.
 * @param {string} url The URL to validate.
 * @returns {Promise<{isValid: boolean, title: string|null, message: string|null}>}
 */
export async function validateAndExtractRssTitle(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { isValid: false, title: null, message: 'URL is empty.' };
  }

  try {
    new URL(url); // Basic URL format validation
  } catch (e) {
    return { isValid: false, title: null, message: 'Invalid URL format.' };
  }

  try {
    // Attempt to fetch and parse the RSS feed
    const feed = await parser.parseURL(url);

    // If parsing is successful, it's likely a valid feed.
    // We can also check for common feed properties like `title` or `items`.
    if (feed && (feed.title || (feed.items && feed.items.length > 0))) {
      return { isValid: true, title: feed.title || null, message: 'Valid RSS feed.' };
    } else {
      // If parser didn't throw an error but couldn't find a title or items, it's not a typical feed.
      return { isValid: false, title: null, message: 'URL is not a recognizable RSS/Atom feed or content is empty.' };
    }
  } catch (error) {
    console.error(`RSS Validation Error for ${url}:`, error.message);
    // Return specific messages for common errors if possible, otherwise a generic one.
    if (error.message.includes('status code 404')) {
      return { isValid: false, title: null, message: 'Feed not found (404).' };
    }
    if (error.message.includes('Non-OK status code') || error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
       return { isValid: false, title: null, message: 'Failed to connect to feed URL or it returned an error status.' };
    }
    if (error.message.includes('Invalid XML') || error.message.includes('Cannot parse XML')) {
        return { isValid: false, title: null, message: 'URL content is not valid XML or RSS/Atom format.' };
    }
    return { isValid: false, title: null, message: `Could not validate RSS feed: ${error.message}` };
  }
}