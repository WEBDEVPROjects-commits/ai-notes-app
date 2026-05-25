const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      return 'No content to summarize';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Please provide a concise summary (2-3 sentences) of the following text:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('Error generating summary:', err);
    throw new Error('Failed to generate summary');
  }
};

const generateTitle = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      return 'Untitled Note';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate a brief, descriptive title (5-10 words max) for the following text. Return only the title, nothing else:\n\n${text.substring(0, 500)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (err) {
    console.error('Error generating title:', err);
    throw new Error('Failed to generate title');
  }
};

module.exports = { generateSummary, generateTitle };
