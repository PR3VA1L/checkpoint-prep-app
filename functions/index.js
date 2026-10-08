const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

// Ensure the API key is set in Firebase functions config:
// firebase functions:config:set gemini.key="YOUR_KEY"
const getApiKey = () => functions.config().gemini?.key || process.env.GEMINI_API_KEY;

exports.geminiProxy = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Endpoint requires authentication.');
  }

  // Rate limiting (simplified version using Firestore)
  const userId = context.auth.uid;
  const db = admin.firestore();
  const rateLimitRef = db.collection('rate_limits').doc(userId);
  const now = Date.now();
  
  const doc = await rateLimitRef.get();
  if (doc.exists) {
    const { count, lastRequest } = doc.data();
    if (now - lastRequest < 60000 && count > 10) {
      throw new functions.https.HttpsError('resource-exhausted', 'Too many requests. Please try again later.');
    }
    if (now - lastRequest >= 60000) {
      await rateLimitRef.set({ count: 1, lastRequest: now });
    } else {
      await rateLimitRef.update({ count: admin.firestore.FieldValue.increment(1) });
    }
  } else {
    await rateLimitRef.set({ count: 1, lastRequest: now });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new functions.https.HttpsError('internal', 'AI service is not configured on the server.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  try {
    const { prompt, systemPrompt, imageBase64 } = data;
    
    if (imageBase64) {
      const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      const result = await model.generateContent([
        prompt, 
        { inlineData: { data: base64Data, mimeType } }
      ]);
      return { text: result.response.text() };
    }

    if (systemPrompt) {
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I will act as the Cambridge Examiner and only output raw JSON." }] }
        ],
        generationConfig: { temperature: 0.2 }
      });
      const result = await chat.sendMessage(prompt);
      return { text: result.response.text() };
    }

    const result = await model.generateContent(prompt);
    return { text: result.response.text() };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new functions.https.HttpsError('internal', 'AI Service Error');
  }
});
