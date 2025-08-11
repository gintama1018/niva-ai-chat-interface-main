// Advanced ElevenLabs TTS service with mood-based voice modulation
export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface MoodVoiceConfig {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  description: string;
}

// Mood-based voice configurations for human-like tone changes
export const MOOD_VOICE_CONFIGS: Record<string, MoodVoiceConfig> = {
  caring: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true,
    description: "Warm, gentle, and nurturing tone"
  },
  energetic: {
    stability: 0.65,
    similarity_boost: 0.75,
    style: 0.8,
    use_speaker_boost: true,
    description: "Upbeat, enthusiastic, and lively tone"
  },
  wise: {
    stability: 0.85,
    similarity_boost: 0.90,
    style: 0.2,
    use_speaker_boost: true,
    description: "Calm, thoughtful, and authoritative tone"
  },
  calm: {
    stability: 0.90,
    similarity_boost: 0.80,
    style: 0.1,
    use_speaker_boost: true,
    description: "Peaceful, relaxed, and soothing tone"
  },
  default: {
    stability: 0.75,
    similarity_boost: 0.80,
    style: 0.4,
    use_speaker_boost: true,
    description: "Natural, balanced tone"
  }
};

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = 'sk_2197c15a91f7d2a415883608a0f1858ce3c875cb674a687c';
const VOICE_ID = 'DCW6BzEL6lvmwVJ4cX5u';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Mood detection from text content
export const detectMoodFromText = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Keywords for different moods
  const moodKeywords = {
    caring: ['care', 'love', 'support', 'help', 'comfort', 'understand', 'feel', 'heart', 'gentle', 'kind', 'प्यार', 'देखभाल', 'सहायता', 'समझ'],
    energetic: ['excited', 'amazing', 'awesome', 'great', 'fantastic', 'wonderful', 'energy', 'active', 'fun', 'celebrate', 'उत्साह', 'शानदार', 'अद्भुत', 'मजा'],
    wise: ['think', 'consider', 'wisdom', 'knowledge', 'understand', 'learn', 'experience', 'advice', 'suggest', 'recommend', 'सोच', 'ज्ञान', 'समझ', 'सलाह'],
    calm: ['peace', 'relax', 'calm', 'quiet', 'serene', 'tranquil', 'meditation', 'breathe', 'rest', 'peaceful', 'शांति', 'आराम', 'स्थिर', 'मन']
  };
  
  let maxScore = 0;
  let detectedMood = 'default';
  
  // Calculate mood scores based on keyword presence
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
      return acc + matches;
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood;
    }
  });
  
  return detectedMood;
};

// Enhanced mood detection based on context and sentiment
export const detectMoodFromContext = (text: string, previousMessages: string[] = []): string => {
  const currentMood = detectMoodFromText(text);
  
  // Analyze previous messages for context
  if (previousMessages.length > 0) {
    const recentContext = previousMessages.slice(-3).join(' ');
    const contextMood = detectMoodFromText(recentContext);
    
    // If context suggests a different mood, blend them
    if (contextMood !== 'default' && contextMood !== currentMood) {
      // Prioritize current message but consider context
      return currentMood !== 'default' ? currentMood : contextMood;
    }
  }
  
  return currentMood;
};

// Request queue to handle ElevenLabs concurrent request limits
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrent = 1; // Conservative limit for ElevenLabs free tier

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.activeRequests++;
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processNext();
        }
      });
      
      this.processNext();
    });
  }

  private processNext() {
    if (this.activeRequests < this.maxConcurrent && this.queue.length > 0) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }
}

const requestQueue = new RequestQueue();

// Generate speech using ElevenLabs API with mood-based voice settings
export const generateSpeechWithMood = async (
  text: string,
  mood: string = 'default',
  previousMessages: string[] = []
): Promise<ArrayBuffer | null> => {
  // Use request queue to prevent concurrent request errors
  return requestQueue.add(async () => {
    try {
      // Detect mood from context if not explicitly provided
      const detectedMood = mood === 'default' ? detectMoodFromContext(text, previousMessages) : mood;
      const voiceConfig = MOOD_VOICE_CONFIGS[detectedMood] || MOOD_VOICE_CONFIGS.default;
      
      console.log(`🎭 Using ${detectedMood} mood: ${voiceConfig.description}`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Supports Hindi and English
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarity_boost,
            style: voiceConfig.style,
            use_speaker_boost: voiceConfig.use_speaker_boost,
          },
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        
        // Handle specific rate limit errors
        if (response.status === 429) {
          console.warn('ElevenLabs rate limit hit, falling back to browser TTS');
        }
        
        return null;
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  });
};

// Play audio from ArrayBuffer
export const playAudioBuffer = (audioBuffer: ArrayBuffer): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Main function to speak text with mood-based voice
export const speakTextWithMood = async (
  text: string, 
  mood: string = 'default',
  previousMessages: string[] = []
): Promise<boolean> => {
  try {
    // Stop any currently playing audio
    stopSpeaking();
    
    const audioBuffer = await generateSpeechWithMood(text, mood, previousMessages);
    
    if (audioBuffer) {
      await playAudioBuffer(audioBuffer);
      return true;
    } else {
      // Fallback to browser TTS if ElevenLabs fails
      console.warn('ElevenLabs TTS failed, falling back to browser TTS');
      return fallbackToWebSpeech(text, mood);
    }
  } catch (error) {
    console.error('Error in speakTextWithMood:', error);
    // Fallback to browser TTS
    return fallbackToWebSpeech(text, mood);
  }
};

// Fallback to Web Speech API with mood-adjusted parameters
const fallbackToWebSpeech = (text: string, mood: string): boolean => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    
    // Adjust voice parameters based on mood
    const moodConfig = MOOD_VOICE_CONFIGS[mood] || MOOD_VOICE_CONFIGS.default;
    
    switch (mood) {
      case 'caring':
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        break;
      case 'energetic':
        utterance.rate = 1.2;
        utterance.pitch = 1.3;
        utterance.volume = 1.0;
        break;
      case 'wise':
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        utterance.volume = 0.95;
        break;
      case 'calm':
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        utterance.volume = 0.8;
        break;
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
    }
    
    window.speechSynthesis.speak(utterance);
    return true;
  }
  
  return false;
};

// Stop all speech
export const stopSpeaking = () => {
  // Stop Web Speech API
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  // Stop any HTML5 audio elements
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
};

// Check if any speech is currently playing
export const isSpeaking = (): boolean => {
  // Check Web Speech API
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    return true;
  }
  
  // Check HTML5 audio elements
  const audioElements = document.querySelectorAll('audio');
  for (const audio of audioElements) {
    if (!audio.paused) {
      return true;
    }
  }
  
  return false;
};

// Get available moods
export const getAvailableMoods = (): string[] => {
  return Object.keys(MOOD_VOICE_CONFIGS);
};

// Get mood description
export const getMoodDescription = (mood: string): string => {
  return MOOD_VOICE_CONFIGS[mood]?.description || 'Unknown mood';
};

// Test ElevenLabs connection
export const testElevenLabsConnection = async (): Promise<boolean> => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('ElevenLabs connection test failed:', error);
    return false;
  }
};