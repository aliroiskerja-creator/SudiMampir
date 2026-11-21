// Vercel Serverless Function — forwards browser requests to Google Apps Script.
// Set GAS_WEB_APP_URL and GAS_API_SECRET in Vercel Environment Variables.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url = process.env.GAS_WEB_APP_URL;
  const secret = process.env.GAS_API_SECRET;
  if (!url || !secret) return res.status(500).json({ok:false,error:'Konfigurasi backend belum lengkap.'});
  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify({...req.body, apiKey:secret})
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Respons GAS bukan JSON. Periksa URL deployment Web App.'); }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ok:false,error:err.message || 'Backend tidak dapat dihubungi.'});
  }
}
