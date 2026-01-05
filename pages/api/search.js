// pages/api/search.js
import ytsr from 'ytsr';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    // Search using ytsr
    const filters1 = await ytsr.getFilters(q);
    const filter1 = filters1.get('Type').get('Video');
    const searchResults = await ytsr(filter1.url, { limit: 5 });

    const items = searchResults.items.map((item) => ({
      title: item.title,
      url: item.url,
      thumbnail: item.bestThumbnail.url,
      author: item.author.name,
      duration: item.duration,
    }));

    res.status(200).json({ results: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search failed' });
  }
}
