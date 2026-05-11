const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url is required' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Only http/https URLs are allowed' });
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResumeMatchBot/1.0)',
        Accept: 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch vacancy page (${response.status})` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    $('script, style, noscript').remove();

    const title = $('h1').first().text().trim() || $('title').text().trim();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const text = `${title}\n\n${bodyText}`.trim();

    if (!text) {
      return res.status(422).json({ error: 'Could not extract text from this page' });
    }

    return res.status(200).json({
      sourceUrl: parsedUrl.toString(),
      title,
      text: text.slice(0, 50000)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to extract vacancy text' });
  }
};

