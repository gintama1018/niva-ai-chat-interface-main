// Text-to-Speech service for Hindi
export const speakText = (text: string, lang: string = 'hi-IN') => {
  // Check if speech synthesis is supported
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the language to Hindi
    utterance.lang = lang;
    
    // Set voice properties for better clarity
    utterance.rate = 1.0;  // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    return true;
  } else {
    console.warn('Speech synthesis not supported in this browser');
    return false;
  }
};

// Stop speaking
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Check if speaking is in progress
export const isSpeaking = () => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};