require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const fallbackParser = (text) => {
    // Very simple mock parser for local testing without API Key
    let merchant = "Unknown";
    let amount = 0;
    let category = "Misc";
    
    const textLower = text.toLowerCase();
    
    // Amount extraction regex (looks for Rs, INR, ₹ followed by numbers)
    const amountMatch = text.match(/(?:rs\.?|inr|₹)\s*(\d+(?:\.\d+)?)/i);
    if (amountMatch) {
        amount = parseFloat(amountMatch[1]);
    }
    
    // Simple merchant and category rules
    if (textLower.includes('swiggy') || textLower.includes('zomato')) {
        merchant = textLower.includes('swiggy') ? 'Swiggy' : 'Zomato';
        category = 'Food & Dining';
    } else if (textLower.includes('uber') || textLower.includes('ola')) {
        merchant = textLower.includes('uber') ? 'Uber' : 'Ola';
        category = 'Travel';
    } else if (textLower.includes('amazon') || textLower.includes('flipkart')) {
        merchant = textLower.includes('amazon') ? 'Amazon' : 'Flipkart';
        category = 'Shopping';
    }
    
    return {
        merchant,
        amount,
        category,
        date: new Date().toISOString(),
        type: 'expense'
    };
};

const parseMessage = async (text) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log("No GEMINI_API_KEY found. Using fallback regex parser.");
        return fallbackParser(text);
    }
    
    try {
        // Initialize Gemini client using the recommended syntax
        const ai = new GoogleGenAI({}); 
        const prompt = `You are an expert financial parsing AI. Extract the transaction details from the following SMS/Email text. 
        Return ONLY a valid JSON object with the following keys:
        - merchant (string): the name of the vendor/merchant.
        - amount (number): the numerical amount spent.
        - category (string): choose one of [Food & Dining, Shopping, Travel, Bills & Utilities, Entertainment, Misc].
        - type (string): "expense" or "income".
        
        Text to parse: "${text}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const data = JSON.parse(response.text);
        data.date = new Date().toISOString();
        return data;
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        return fallbackParser(text);
    }
};

module.exports = { parseMessage };
