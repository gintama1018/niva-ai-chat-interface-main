"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff,
  Activity,
  Brain,
  Zap,
  Heart,
  Sparkles
} from "lucide-react";

interface MoodState {
  type: 'calm' | 'excited' | 'focused' | 'happy' | 'thinking';
  intensity: number;
  color: string;
}

interface ConversationState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  volume: number;
  mood: MoodState;
}

const NeuralParticle = ({ delay, mood }: { delay: number; mood: MoodState }) => {
  const baseColor = mood.color;
  const intensity = mood.intensity;
  
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full opacity-60"
      style={{
        background: `radial-gradient(circle, ${baseColor}80, transparent)`,
        boxShadow: `0 0 ${2 + intensity}px ${baseColor}`,
      }}
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: 0
      }}
      animate={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: [0, 1, 0],
        opacity: [0, intensity * 0.8, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const VoiceWaveform = ({ isActive, isSpeaking, intensity }: { isActive: boolean; isSpeaking: boolean; intensity: number }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full"
          animate={{
            height: isActive ? 
              (isSpeaking ? Math.random() * 40 + 8 : Math.random() * 20 + 4) : 
              8,
            opacity: isActive ? 1 : 0.3
          }}
          transition={{
            duration: 0.1,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  );
};

const NAVIAvatar = ({ mood, isListening, isSpeaking, isActive }: { 
  mood: MoodState; 
  isListening: boolean; 
  isSpeaking: boolean;
  isActive: boolean;
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  
  const getAvatarState = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  const avatarState = getAvatarState();

  return (
    <div className="relative flex items-center justify-center">
      {/* Particle Ring */}
      <div className="absolute inset-0 w-80 h-80">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${mood.color}, transparent)`,
              boxShadow: `0 0 8px ${mood.color}`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 2 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              left: `${50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}%`,
              top: `${50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}%`,
            }}
          />
        ))}
      </div>

      {/* Main Avatar */}
      <motion.div
        ref={avatarRef}
        className="relative w-64 h-64 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${mood.color}20, transparent 70%)`,
          border: `2px solid ${mood.color}40`,
          boxShadow: `
            0 0 40px ${mood.color}30,
            inset 0 0 40px ${mood.color}20,
            0 0 80px ${mood.color}10
          `,
        }}
        animate={{
          scale: avatarState === 'speaking' ? [1, 1.05, 1] : [1, 1.02, 1],
          rotate: [0, 1, -1, 0],
          y: [0, -4, 4, 0],
        }}
        transition={{
          scale: {
            duration: avatarState === 'speaking' ? 0.3 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Inner Core */}
        <motion.div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${mood.color}60, ${mood.color}20)`,
            boxShadow: `
              0 0 20px ${mood.color}50,
              inset 0 0 20px ${mood.color}30
            `,
          }}
          animate={{
            scale: avatarState === 'listening' ? [1, 1.1, 1] : [1, 1.05, 1],
          }}
          transition={{
            duration: avatarState === 'listening' ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* NAVI Text */}
          <motion.div
            className="text-white font-display font-bold text-2xl tracking-wider"
            style={{
              textShadow: `0 0 10px ${mood.color}`,
              filter: `drop-shadow(0 0 5px ${mood.color})`
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            NAVI
          </motion.div>
        </motion.div>

        {/* Breathing Particles */}
        <AnimatePresence>
          {isActive && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: mood.color,
                    boxShadow: `0 0 4px ${mood.color}`,
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const MoodSelector = ({ mood, onMoodChange }: { 
  mood: MoodState; 
  onMoodChange: (mood: MoodState) => void;
}) => {
  const moods: MoodState[] = [
    { type: 'calm', intensity: 0.6, color: '#3b82f6' },
    { type: 'excited', intensity: 0.9, color: '#f59e0b' },
    { type: 'focused', intensity: 0.8, color: '#8b5cf6' },
    { type: 'happy', intensity: 0.7, color: '#10b981' },
    { type: 'thinking', intensity: 0.5, color: '#6b7280' },
  ];

  const getMoodIcon = (type: string) => {
    switch (type) {
      case 'calm': return <Heart className="w-4 h-4" />;
      case 'excited': return <Zap className="w-4 h-4" />;
      case 'focused': return <Brain className="w-4 h-4" />;
      case 'happy': return <Sparkles className="w-4 h-4" />;
      case 'thinking': return <Activity className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Mood</h3>
      <div className="flex gap-3 mb-4">
        {moods.map((m) => (
          <Button
            key={m.type}
            variant={mood.type === m.type ? "default" : "outline"}
            size="sm"
            onClick={() => onMoodChange(m)}
            className={`
              border-white/20 transition-all duration-300
              ${mood.type === m.type 
                ? `bg-gradient-to-r text-white shadow-lg` 
                : `bg-black/20 text-white/70 hover:text-white hover:bg-white/10`
              }
            `}
            style={{
              background: mood.type === m.type ? 
                `linear-gradient(135deg, ${m.color}60, ${m.color}40)` : undefined,
              boxShadow: mood.type === m.type ? 
                `0 0 20px ${m.color}40, 0 4px 20px black/20` : undefined
            }}
          >
            {getMoodIcon(m.type)}
            <span className="capitalize ml-2">{m.type}</span>
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70">Intensity</label>
        <Slider
          value={[mood.intensity * 100]}
          onValueChange={(value) => 
            onMoodChange({ ...mood, intensity: value[0] / 100 })
          }
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </Card>
  );
};

export const LiveConversationInterface = () => {
  const [conversation, setConversation] = useState<ConversationState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    isMuted: false,
    volume: 80,
    mood: { type: 'calm', intensity: 0.6, color: '#3b82f6' }
  });

  const particles = Array.from({ length: 50 }, (_, i) => i);

  const toggleConversation = () => {
    setConversation(prev => ({
      ...prev,
      isActive: !prev.isActive,
      isListening: false,
      isSpeaking: false
    }));
  };

  const toggleMute = () => {
    setConversation(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  };

  const startListening = () => {
    if (!conversation.isActive) return;
    
    setConversation(prev => ({
      ...prev,
      isListening: true,
      isSpeaking: false
    }));

    // Simulate listening duration
    setTimeout(() => {
      setConversation(prev => ({
        ...prev,
        isListening: false,
        isSpeaking: true
      }));

      // Simulate speaking duration
      setTimeout(() => {
        setConversation(prev => ({
          ...prev,
          isSpeaking: false
        }));
      }, 3000);
    }, 2000);
  };

  const handleMoodChange = (newMood: MoodState) => {
    setConversation(prev => ({
      ...prev,
      mood: newMood
    }));
  };

  const handleVolumeChange = (value: number[]) => {
    setConversation(prev => ({
      ...prev,
      volume: value[0]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Neural Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((i) => (
          <NeuralParticle 
            key={i} 
            delay={i * 0.1} 
            mood={conversation.mood}
          />
        ))}
      </div>

      {/* Main Interface */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Status Header */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="px-6 py-3 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: conversation.mood.color }}
                animate={{
                  scale: conversation.isActive ? [1, 1.2, 1] : 1,
                  opacity: conversation.isActive ? [0.7, 1, 0.7] : 0.5
                }}
                transition={{
                  duration: 2,
                  repeat: conversation.isActive ? Infinity : 0
                }}
              />
              <span className="text-white font-mono text-sm">
                NAVI 10.8.007 {conversation.isActive ? 'ONLINE' : 'STANDBY'}
              </span>
              {conversation.isListening && (
                <span className="text-blue-400 text-xs">LISTENING...</span>
              )}
              {conversation.isSpeaking && (
                <span className="text-green-400 text-xs">SPEAKING...</span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {/* NAVI Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <NAVIAvatar
              mood={conversation.mood}
              isListening={conversation.isListening}
              isSpeaking={conversation.isSpeaking}
              isActive={conversation.isActive}
            />
          </motion.div>

          {/* Voice Waveform */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <VoiceWaveform
              isActive={conversation.isActive}
              isSpeaking={conversation.isSpeaking}
              intensity={conversation.mood.intensity}
            />
          </motion.div>

          {/* Voice Controls */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Main Voice Button */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={startListening}
                disabled={!conversation.isActive}
                className={`
                  w-20 h-20 rounded-full relative overflow-hidden
                  ${conversation.isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500' 
                    : 'bg-gray-600'
                  }
                  border-2 border-white/20 shadow-2xl
                `}
                style={{
                  boxShadow: conversation.isActive ? 
                    `0 0 30px ${conversation.mood.color}40, 0 8px 30px black/30` : 
                    '0 8px 30px black/30'
                }}
              >
                {conversation.isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
                
                {/* Pulsing rings */}
                <AnimatePresence>
                  {conversation.isListening && (
                    <>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: conversation.mood.color }}
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Secondary Controls */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleMute}
                className="w-12 h-12 rounded-full border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10"
              >
                {conversation.isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={toggleConversation}
                className={`
                  w-12 h-12 rounded-full border-white/20 backdrop-blur-md
                  ${conversation.isActive 
                    ? 'bg-red-500/80 hover:bg-red-500 text-white' 
                    : 'bg-green-500/80 hover:bg-green-500 text-white'
                  }
                `}
              >
                {conversation.isActive ? (
                  <PhoneOff className="w-5 h-5" />
                ) : (
                  <Phone className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Side Controls */}
        <motion.div
          className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {/* Mood Selector */}
          <MoodSelector
            mood={conversation.mood}
            onMoodChange={handleMoodChange}
          />

          {/* Volume Control */}
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Volume</h3>
            <div className="flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-white/70" />
              <Slider
                value={[conversation.volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-24"
              />
              <Volume2 className="w-4 h-4 text-white/70" />
            </div>
            <div className="text-center text-sm text-white/70 mt-2">
              {conversation.volume}%
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};