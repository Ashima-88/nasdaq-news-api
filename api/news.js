import https from 'https';

export default async function handler(req, res) {
  const options = {
    hostname: 'nassdaq-news-feed.mockapi.io', // فقط یک دامنه فیک به‌عنوان مثال
    path: '/latest-news',
    method: 'GET'
  };

  let data = '';

  const request = https.request(options, response => {
    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      const rawNews = JSON.parse(data);

      // خلاصه‌سازی و ترجمه ساده
      const summarized = rawNews.slice(0, 3).map(n => ({
        title: `🗞️ ${n.title}`,
        summary: `📝 ${n.content.slice(0, 150)}...`, // خلاصه
        translated: `🇮🇷 ${translateToFarsi(n.content)}` // ترجمه ساختگی
      }));

      res.status(200).json(summarized);
    });
  });

  request.on('error', error => {
    res.status(500).json({ error: error.message });
  });

  request.end();
}

// تابع ساختگی ترجمه (به جای GPT یا API)
function translateToFarsi(text) {
  return `ترجمه‌شده: ${text.slice(0, 100)} ...`;
}
