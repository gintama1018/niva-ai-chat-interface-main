"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Send, Mic, MicOff, Volume2, VolumeX, Heart, Zap, Star, Moon, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { generateContent } from "@/lib/gemini-service";
import { speakTextWithMood, stopSpeaking, isSpeaking, detectMoodFromContext } from "@/lib/elevenlabs-tts-service";
import speechToTextService from "@/lib/stt-service";

interface Message {
  id: string;
  text: string;
  sender: "user" | "navi";
  timestamp: Date;
  mood?: string;
  isLoading?: boolean;
}

interface Mood {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  theme: string;
  personality: string;
}

const moods: Mood[] = [
  {
    id: "caring",
    name: "Caring",
    icon: Heart,
    color: "#ec4899",
    theme: "pink",
    personality: "I'm here for you with warmth and understanding. I'll listen carefully and respond with empathy."
  },
  {
    id: "energetic",
    name: "Energetic", 
    icon: Zap,
    color: "#a855f7",
    theme: "purple",
    personality: "Let's tackle anything together with enthusiasm! I'm ready to help you achieve your goals with energy."
  },
  {
    id: "wise",
    name: "Wise",
    icon: Star,
    color: "#3b82f6",
    theme: "blue",
    personality: "I'll share thoughtful insights and guidance. Let me help you think through complex problems."
  },
  {
    id: "calm",
    name: "Calm",
    icon: Moon,
    color: "#6366f1",
    theme: "indigo",
    personality: "Let's find peace and clarity together. I'll provide balanced, mindful responses."
  },
  {
    id: "playful",
    name: "Playful",
    icon: Sparkles,
    color: "#10b981",
    theme: "green",
    personality: "Ready for some fun and creative adventures! Let's explore ideas with imagination and joy."
  }
];

// Enhanced Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-transparent border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing core */}
        <motion.div
          className="absolute inset-3 sm:inset-4 bg-gradient-to-r from-primary to-accent-metallic rounded-full"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-metallic rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 20],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Particle System with 3D effects
const ParticleSystem = ({ mood, isActive }: { mood: Mood; isActive: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Only generate particles on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      setParticles(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      })));
    }
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${mood.color}, transparent)`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={isActive ? {
            y: [-20, -80],
            x: [0, Math.random() * 40 - 20],
            opacity: [0.8, 0],
            scale: [1, 0.3],
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Typing Indicator with brain wave animation
const TypingIndicator = ({ mood }: { mood: Mood }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4"
    >
      <div className="flex items-center space-x-2">
        {/* Animated brain wave pattern */}
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 sm:w-1 bg-gradient-to-t from-transparent via-current to-transparent rounded-full"
              style={{ color: mood.color }}
              animate={{
                height: [3, 8, 6, 12, 4],
                opacity: [0.3, 1, 0.5, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Typing dots */}
        <div className="flex space-x-1 ml-2 sm:ml-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
              style={{ backgroundColor: mood.color }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
      
      <motion.span 
        className="text-xs sm:text-sm text-muted-foreground font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        NAVI is processing...
      </motion.span>
    </motion.div>
  );
};

// Enhanced Message Bubble with 3D hover effects and mood-based voice
const MessageBubble = ({
  message,
  mood,
  isSoundEnabled,
  previousMessages = []
}: {
  message: Message;
  mood: Mood;
  isSoundEnabled: boolean;
  previousMessages?: string[];
}) => {
  const isUser = message.sender === "user";
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Speak the message text with mood-based voice when it's a NAVI message and not loading
  useEffect(() => {
    // Skip TTS for the initial welcome message and only enable for new messages
    if (!isUser && !message.isLoading && message.text && isSoundEnabled && message.id !== "1") {
      // Use requestIdleCallback for better performance, fallback to setTimeout
      const scheduleVoice = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(callback, { timeout: 1000 });
        } else {
          setTimeout(callback, 1000);
        }
      };

      scheduleVoice(() => {
        // Double-check conditions before proceeding
        if (!isUser && !message.isLoading && message.text && isSoundEnabled && message.id !== "1") {
          setIsPlaying(true);
          
          // Get previous message texts for context
          const recentMessages = previousMessages.slice(-3);
          
          // Use mood-based TTS with ElevenLabs (completely non-blocking)
          speakTextWithMood(message.text, mood.id, recentMessages)
            .then(() => {
              setIsPlaying(false);
            })
            .catch((error: any) => {
              console.warn('TTS failed, continuing silently:', error);
              setIsPlaying(false);
            });
        }
      });
    }
  }, [message.text, isUser, message.isLoading, isSoundEnabled, mood.id, previousMessages, message.id]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 sm:mb-6 px-2 sm:px-0`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-5 py-2 sm:py-3 rounded-2xl relative overflow-hidden ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card/90 backdrop-blur-md border border-border/50"
        } shadow-lg`}
        style={
          !isUser
            ? {
                borderColor: `${mood.color}40`,
                boxShadow: isHovered 
                  ? `0 8px 32px ${mood.color}30, 0 0 0 1px ${mood.color}20`
                  : `0 4px 20px ${mood.color}15`,
              }
            : undefined
        }
        whileHover={{
          y: -2,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {/* Animated background gradient for NAVI messages */}
        {!isUser && (
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${mood.color}, transparent, ${mood.color})`
            }}
            animate={{
              backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : ['0% 0%', '0% 0%']
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
        
        <div className="relative z-10">
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" style={{ color: mood.color }} />
              <span className="text-xs sm:text-sm">Thinking...</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
          )}
          
          <div className="flex items-center justify-between mt-1 sm:mt-2">
            <div className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {!isUser && !message.isLoading && (
              <div className="flex items-center space-x-2">
                {/* Voice playing indicator */}
                {isPlaying && (
                  <motion.div
                    className="flex space-x-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 h-2 rounded-full"
                        style={{ backgroundColor: mood.color }}
                        animate={{
                          height: [2, 6, 2],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {/* Mood indicator */}
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: mood.color }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Background Particles Component
const BackgroundParticles = ({ currentMood }: { currentMood: Mood }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Only generate particles on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      setParticles(Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      })));
    }
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, ${currentMood.color}40, transparent)`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
            x: [0, Math.random() * 15 - 7.5],
            y: [0, Math.random() * 15 - 7.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </>
  );
};

export const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! मैं NAVI 10.8.007 हूँ, आपका व्यक्तिगत AI सहायक। मैं आज आपकी सहायता के लिए उत्तेजित हूँ! चुनें कि आप कैसे मूड में मुझे इंटरैक्ट करना चाहेंगे।",
      sender: "navi",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moodSwitchAnimation, setMoodSwitchAnimation] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Enhanced message sending with Gemini API integration
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      text: "",
      sender: "navi",
      timestamp: new Date(),
      isLoading: true,
      mood: currentMood.id,
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Prepare chat history for Gemini API - only include actual conversation messages
      const conversationHistory: any[] = messages
        .filter(msg =>
          !msg.isLoading &&
          msg.text.trim() !== "" &&
          msg.id !== "1" // Exclude the initial welcome message
        )
        .map(msg => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }));

      // Ensure the first message in history is from user if history exists
      if (conversationHistory.length > 0 && conversationHistory[0].role !== "user") {
        conversationHistory.shift(); // Remove first model message if it exists
      }

      console.log("Sending to Gemini:", { prompt: inputValue, history: conversationHistory });

      // Get response from Gemini API
      const response = await generateContent(inputValue, conversationHistory);
      
      console.log("Received from Gemini:", response);
      
      // Remove loading message and add real response
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const naviMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "navi",
        timestamp: new Date(),
        mood: currentMood.id,
      };

      setMessages(prev => [...prev, naviMessage]);
    } catch (error) {
      console.error("Error generating content:", error);
      
      // Remove loading message and add error message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "क्षमा करें, मैं आपका उत्तर नहीं दे सका। कृपया पुन: प्रयास करें।",
        sender: "navi",
        timestamp: new Date(),
        mood: currentMood.id,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Speech-to-text functionality
  const toggleVoiceRecording = () => {
    // Check if speechToTextService is available
    if (!speechToTextService || !speechToTextService.isAvailable()) {
      console.warn('Speech recognition not available');
      return;
    }

    if (isListening) {
      // Stop listening
      speechToTextService.stopListening();
      setIsListening(false);
      setIsVoiceActive(false);
    } else {
      // Start listening
      const success = speechToTextService.startListening(
        (text) => {
          // On result
          setInputValue(text);
          setIsListening(false);
          setIsVoiceActive(false);
        },
        (error) => {
          // On error
          console.error('Speech recognition error:', error);
          setIsListening(false);
          setIsVoiceActive(false);
        },
        () => {
          // On end
          setIsListening(false);
          setIsVoiceActive(false);
        }
      );
      
      if (success) {
        setIsListening(true);
        setIsVoiceActive(true);
      }
    }
  };

  // Enhanced mood switching with animations
  const handleMoodChange = (mood: Mood) => {
    if (mood.id === currentMood.id) return;
    
    setMoodSwitchAnimation(mood.id);
    setIsLoading(true);
    
    // Animate mood transition
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });

    setTimeout(() => {
      setCurrentMood(mood);
      setIsLoading(false);
      setMoodSwitchAnimation(null);
      
      const moodMessage: Message = {
        id: Date.now().toString(),
        text: `✨ ${mood.name} मोड में बदल रहे हैं। मैं इस नई ऊर्जा के साथ आपकी सहायता के लिए तैयार हूँ! अब मेरी आवाज़ भी ${mood.name} टोन में होगी।`,
        sender: "navi",
        timestamp: new Date(),
        mood: mood.id,
      };
      
      setMessages(prev => [...prev, moodMessage]);
    }, 800);
  };

  // Enhanced click ripple effect
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
    setTimeout(() => setClickPosition(null), 1200);
  };

  return (
    <motion.div 
      className="h-screen bg-background relative overflow-hidden"
      onClick={handleClick}
      animate={controls}
    >
      {/* Enhanced Neural Network Background with mood-responsive colors */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br via-transparent"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentMood.color}15, transparent 70%)`
          }}
          animate={{
            background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${currentMood.color}20, transparent 70%)`
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Floating neural network nodes - reduced for mobile */}
        <BackgroundParticles currentMood={currentMood} />
      </div>

      {/* Enhanced Click Animation with mood colors */}
      <AnimatePresence>
        {clickPosition && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: clickPosition.x - 20,
              top: clickPosition.y - 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div 
              className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2"
              style={{ 
                borderColor: currentMood.color,
                boxShadow: `0 0 15px ${currentMood.color}60`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Container */}
      <div className="flex flex-col h-full relative z-10">
        {/* Enhanced Header with mood indicator */}
        <motion.div 
          className="bg-card/90 backdrop-blur-xl border-b border-border/50 p-3 sm:p-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-accent-metallic/50 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    `0 0 15px ${currentMood.color}40`,
                    `0 0 25px ${currentMood.color}60`,
                    `0 0 15px ${currentMood.color}40`,
                  ],
                  rotate: [0, 360]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              >
                <span className="text-sm sm:text-lg font-bold">N</span>
                
                {/* Status indicator */}
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: currentMood.color }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <h1 className="text-sm sm:text-xl font-bold font-display">NAVI 10.8.007</h1>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <motion.span 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: currentMood.color }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentMood.name} Mode
                  </motion.span>
                  <div 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                    style={{ backgroundColor: currentMood.color }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <motion.button
                className="p-1.5 sm:p-2 rounded-lg hover:bg-accent/20 transition-colors"
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentMood.color }} />
                ) : (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                )}
              </motion.button>
              
              <motion.button
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                  isVoiceActive 
                    ? "text-white shadow-lg" 
                    : "hover:bg-accent/20 text-muted-foreground hover:text-foreground"
                }`}
                style={
                  isVoiceActive
                    ? {
                        backgroundColor: currentMood.color,
                        boxShadow: `0 4px 20px ${currentMood.color}40`,
                      }
                    : undefined
                }
                onClick={toggleVoiceRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isVoiceActive ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={isVoiceActive ? {
                  duration: 1,
                  repeat: Infinity
                } : {}}
              >
                {isVoiceActive ? (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Mood Selector with 3D effects */}
        <motion.div
          className="bg-card/70 backdrop-blur-md border-b border-border/30 p-2 sm:p-4"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-metallic/30">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isActive = currentMood.id === mood.id;
              const isSwitching = moodSwitchAnimation === mood.id;
              
              return (
                <motion.button
                  key={mood.id}
                  className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all relative overflow-hidden min-w-fit ${
                    isActive
                      ? "text-white shadow-xl"
                      : "text-muted-foreground hover:text-foreground bg-card/40 hover:bg-card/60"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: mood.color,
                          boxShadow: `0 4px 20px ${mood.color}40, 0 0 0 1px ${mood.color}30`,
                        }
                      : undefined
                  }
                  onClick={() => handleMoodChange(mood)}
                  whileHover={{ 
                    scale: 1.05,
                    y: -1,
                    boxShadow: isActive 
                      ? `0 6px 25px ${mood.color}50`
                      : `0 2px 10px rgba(255,255,255,0.1)`
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={isSwitching ? {
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360]
                  } : {}}
                  transition={isSwitching ? {
                    duration: 0.8
                  } : {}}
                >
                  <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="font-semibold">{mood.name}</span>
                  
                  {isActive && <ParticleSystem mood={mood} isActive={isActive} />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Messages Container with smooth scrolling */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${currentMood.color}40 transparent`,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {messages.map((message, index) => {
              // Get previous messages for context
              const previousMessages = messages
                .slice(0, index)
                .filter(msg => msg.sender === "navi" && !msg.isLoading)
                .map(msg => msg.text);
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring"
                  }}
                >
                  <MessageBubble
                    message={message}
                    mood={currentMood}
                    isSoundEnabled={isSoundEnabled}
                    previousMessages={previousMessages}
                  />
                </motion.div>
              );
            })}
            
            <AnimatePresence>
              {isTyping && <TypingIndicator mood={currentMood} />}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </motion.div>
        </div>

        {/* Enhanced Input Area with 3D effects */}
        <motion.div
          className="bg-card/90 backdrop-blur-xl border-t border-border/50 p-3 sm:p-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
        >
          <div className="flex space-x-2 sm:space-x-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`NAVI के साथ हिंदी में चैट करें...`}
                className="bg-background/70 backdrop-blur-sm border-border/50 focus:border-primary/50 pr-12 py-2 sm:py-3 text-sm sm:text-base rounded-xl transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  boxShadow: `0 0 0 1px ${currentMood.color}20, 0 4px 20px rgba(0,0,0,0.1)`,
                }}
              />
              
              {/* Voice recording indicator */}
              {isVoiceActive && (
                <motion.div
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: currentMood.color }}
                  />
                </motion.div>
              )}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: inputValue.trim() ? currentMood.color : '#6b7280',
                  boxShadow: inputValue.trim() ? `0 4px 20px ${currentMood.color}30` : 'none',
                }}
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};