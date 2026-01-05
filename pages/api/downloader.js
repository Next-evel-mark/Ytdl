// pages/api/download.js
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Clean filename

    // Set headers to force download as MP3
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // Stream the audio directly to the user
    ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
      format: 'mp3' 
    }).pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to process download.');
  }
}
