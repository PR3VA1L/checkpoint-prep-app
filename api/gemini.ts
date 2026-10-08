import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountStr))
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user via Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    if (admin.apps.length) {
      try {
        await admin.auth().verifyIdToken(idToken);
      } catch (e) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    } else {
      // If no service account is provided, we can optionally reject or accept the token.
      // Since this is a student prototype, if they forgot the service account we'll gracefully accept it but log a warning.
      console.warn("No FIREBASE_SERVICE_ACCOUNT_KEY found. Bypassing strict auth verification.");
    }

    const { prompt, systemPrompt, imageBase64 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');
    let resultText = '';

    if (imageBase64) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg',
          },
        },
      ]);
      resultText = result.response.text();
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
      const result = await model.generateContent(prompt);
      resultText = result.response.text();
    }

    return res.status(200).json({ data: { text: resultText } });
  } catch (error) {
    console.error('Error in gemini proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
