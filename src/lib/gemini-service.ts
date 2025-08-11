import { GoogleGenerativeAI } from "@google/generative-ai";

// Define types locally if they're not exported
interface Content {
  role: "user" | "model";
  parts: Part[];
}

interface Part {
  text: string;
}

// Initialize the Gemini API client with your API key
const genAI = new GoogleGenerativeAI("AIzaSyBHqaN8vEFyqnf1GtZPYBbG884wsgEf3C0");

// Function to get the Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Using gemini-1.5-flash as gemini-2.0-flash might not be available yet
    generationConfig: {
      maxOutputTokens: 200, // Limit response length
      temperature: 0.7, // Balance creativity and accuracy
      topP: 0.8,
      topK: 40
    },
    systemInstruction: "You are NAVI, a helpful AI assistant. Respond ONLY in Hindi language. Keep your responses very concise and to the point. Don't provide lengthy explanations unless specifically asked for. Answer exactly what is asked, no more, no less. Always respond in Hindi."
  });
};

// Function to generate content using the Gemini API
export const generateContent = async (prompt: string, history: Content[] = []) => {
  try {
    const model = getModel();
    
    // Filter and format the chat history properly
    const formattedHistory: Content[] = history
      .filter(msg => msg.role === "user" || msg.role === "model")
      .map(msg => ({
        role: msg.role,
        parts: Array.isArray(msg.parts) 
          ? msg.parts.map(part => typeof part === 'string' ? { text: part } : part)
          : [{ text: String(msg.parts) }]
      }));
    
    // If we have history, start a chat session
    if (formattedHistory.length > 0) {
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });
      
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } else {
      // For the first message, use generateContent directly
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error generating content:", error);
    
    // Return a fallback response in Hindi
    return "क्षमा करें, मैं अभी आपका उत्तर नहीं दे सकता। कृपया पुन: प्रयास करें।";
  }
};

// Function to generate content stream using the Gemini API
export const generateContentStream = async (prompt: string, history: Content[] = []) => {
  try {
    const model = getModel();
    
    // Filter and format the chat history properly
    const formattedHistory: Content[] = history
      .filter(msg => msg.role === "user" || msg.role === "model")
      .map(msg => ({
        role: msg.role,
        parts: Array.isArray(msg.parts) 
          ? msg.parts.map(part => typeof part === 'string' ? { text: part } : part)
          : [{ text: String(msg.parts) }]
      }));
    
    // If we have history, start a chat session
    if (formattedHistory.length > 0) {
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });
      
      const result = await chat.sendMessageStream(prompt);
      return result.stream;
    } else {
      // For the first message, use generateContentStream directly
      const result = await model.generateContentStream(prompt);
      return result.stream;
    }
  } catch (error) {
    console.error("Error generating content stream:", error);
    throw new Error("Failed to generate response stream from AI");
  }
};