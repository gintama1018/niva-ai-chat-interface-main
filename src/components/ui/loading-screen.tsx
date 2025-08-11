"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  progress: number;
  onComplete?: () => void;
  isVisible: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
  active: boolean;
}

const getLoadingStage = (progress: number) => {
  if (progress < 25) return { stage: "Initialization", text: "Setting up neural networks..." };
  if (progress < 50) return { stage: "Connection", text: "Establishing AI link..." };
  if (progress < 75) return { stage: "Authentication", text: "Verifying user credentials..." };
  return { stage: "Ready", text: "NAVI online and ready" };
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  progress, 
  onComplete, 
  isVisible 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);

  const currentStage = getLoadingStage(progress);

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    setParticles(newParticles);
  }, []);

  // Initialize neural network nodes
  useEffect(() => {
    const newNodes: Node[] = [];
    for (let i = 0; i < 20; i++) {
      const connections = [];
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numConnections; j++) {
        const connectionId = Math.floor(Math.random() * 20);
        if (connectionId !== i && !connections.includes(connectionId)) {
          connections.push(connectionId);
        }
      }
      newNodes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        connections,
        active: Math.random() > 0.5
      });
    }
    setNodes(newNodes);
  }, []);

  // Initialize matrix characters
  useEffect(() => {
    const chars = [];
    const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    for (let i = 0; i < 100; i++) {
      chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
    }
    setMatrixChars(chars);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        opacity: 0.2 + (progress / 100) * 0.6
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // Activate nodes based on progress
  useEffect(() => {
    const activeCount = Math.floor((progress / 100) * nodes.length);
    setNodes(prev => prev.map((node, index) => ({
      ...node,
      active: index < activeCount
    })));
  }, [progress, nodes.length]);

  // Glitch effect trigger
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Handle completion
  useEffect(() => {
    if (progress >= 100 && onComplete) {
      setTimeout(onComplete, 1000);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Neural Network Background */}
          <div className="absolute inset-0">
            <svg className="w-full h-full">
              {nodes.map(node => (
                <g key={node.id}>
                  {node.connections.map(connectionId => {
                    const connectedNode = nodes[connectionId];
                    if (!connectedNode) return null;
                    return (
                      <motion.line
                        key={`${node.id}-${connectionId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={connectedNode.x}
                        y2={connectedNode.y}
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity={node.active && connectedNode.active ? 0.4 : 0.1}
                        initial={{ pathLength: 0 }}
                        animate={{ 
                          pathLength: node.active && connectedNode.active ? 1 : 0,
                          opacity: node.active && connectedNode.active ? 0.4 : 0.1
                        }}
                        transition={{ duration: 2 }}
                      />
                    );
                  })}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.active ? 4 : 2}
                    fill={node.active ? "#3b82f6" : "#262626"}
                    animate={{
                      scale: node.active ? [1, 1.5, 1] : 1,
                      opacity: node.active ? [0.8, 1, 0.8] : 0.3
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute bg-accent-metallic rounded-full blur-sm"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.id * 0.1
                }}
              />
            ))}
          </div>

          {/* Matrix Rain Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="flex justify-around h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col font-mono text-xs text-primary"
                  animate={{ y: ['-100%', '100vh'] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2
                  }}
                >
                  {matrixChars.slice(i * 5, (i + 1) * 5).map((char, j) => (
                    <span key={j} className="block leading-tight">
                      {char}
                    </span>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
            {/* NAVI Branding */}
            <motion.div
              className={`text-6xl md:text-8xl font-display font-bold text-primary mb-8 ${
                glitchActive ? 'animate-pulse' : ''
              }`}
              style={{
                textShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
                filter: glitchActive ? 'hue-rotate(180deg) saturate(200%)' : 'none'
              }}
              animate={{
                textShadow: [
                  '0 0 30px rgba(59, 130, 246, 0.6)',
                  '0 0 50px rgba(59, 130, 246, 0.8)',
                  '0 0 30px rgba(59, 130, 246, 0.6)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              NAVI
            </motion.div>

            {/* Loading Stage */}
            <motion.div
              className="text-center mb-12"
              key={currentStage.stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-medium text-text-primary mb-2">
                {currentStage.stage}
              </h2>
              <p className="text-text-secondary">
                {currentStage.text}
              </p>
            </motion.div>

            {/* Progress Container */}
            <div className="w-full max-w-md">
              {/* Progress Bar */}
              <div className="relative mb-4">
                <div className="h-1 bg-surface-2 rounded-full overflow-hidden backdrop-blur-md">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent-metallic relative"
                    style={{
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Progress Percentage */}
              <div className="flex justify-between items-center">
                <motion.span
                  className="text-text-secondary font-mono text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStage.stage.toUpperCase()}
                </motion.span>
                <motion.span
                  className="text-primary font-mono text-sm font-semibold"
                  key={progress}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
            </div>

            {/* Rotating Geometric Elements */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <motion.div
                className="w-16 h-16 border border-primary/30 rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="w-8 h-8 border border-accent-metallic/50 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Glassmorphic Overlay */}
          <div className="absolute inset-0 bg-glass-overlay backdrop-blur-sm pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};