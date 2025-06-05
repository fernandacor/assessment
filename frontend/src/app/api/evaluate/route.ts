import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userData = req.body;

  try {
    // Aquí se manda al servicio de cómputo
    const computeRes = await fetch('http://COMPUTE_SERVICE_HOST:PORT/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const prediction = await computeRes.json();

    res.status(200).json({ success: true, prediction });
  } catch (err) {
    console.error('Error comunicando con servicio de cómputo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
