export default async function handler(req, res) {
  // CORS sazlamalary (isleseňiz öz GitHub Pages ýa-da Vercel domainiňizi goýup bilersiňiz)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  // Vercel Environment Variable-dan API key-i alýarys
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'API key is not configured on server' });
  }

  try {
    const base = 'https://api.openweathermap.org/data/2.5';
    
    // Serverless funksiýanyň içinden OpenWeatherMap-a ýüzlenýäris
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${base}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`),
      fetch(`${base}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`)
    ]);

    if (!currentRes.ok) {
      const errorData = await currentRes.json().catch(() => ({}));
      return res.status(currentRes.status).json(errorData);
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Lokoal backend brauzere diňe maglumatlary gaýtaryp berýär
    return res.status(200).json({ current, forecast });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}