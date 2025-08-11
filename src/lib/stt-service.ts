// Speech-to-Text service for Hindi
class SpeechToTextService {
  private recognition: any;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Check if browser supports speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition for Hindi
    this.recognition.lang = 'hi-IN';
    this.recognition.continuous = false; // Stop after first result
    this.recognition.interimResults = false; // Only return final results

    // Event handlers
    this.recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        if (this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  // Start listening for speech
  startListening(
    onResult: (text: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      if (onError) onError('Speech recognition not available in server environment');
      return false;
    }

    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.onEndCallback = onEnd || null;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      if (onError) onError('Failed to start speech recognition');
      return false;
    }
  }

  // Stop listening
  stopListening() {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;

    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if service is available
  isAvailable() {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return false;
    return !!this.recognition;
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }
}

// Create a singleton instance only in browser environment
const speechToTextService = typeof window !== 'undefined' ? new SpeechToTextService() : null;

export default speechToTextService;