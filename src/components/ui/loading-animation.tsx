"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingProps {
  type?: 'neural' | 'matrix' | 'particle' | 'brainwave' | 'orbit' | 'glitch';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  color?: string;
  progress?: number;
  showProgress?: boolean;
  overlay?: boolean;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingProps> = ({
  type = 'neural',
  size = 'medium',
  color = '#3b82f6',
  progress,
  showProgress = false,
  overlay = false,
  className = '',
}) => {
  const [matrixText, setMatrixText] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'matrix') {
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      const newText = Array.from({ length: 20 }, () =>
        Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      );
      setMatrixText(newText);
      
      const interval = setInterval(() => {
        const updatedText = Array.from({ length: 20 }, () =>
          Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        );
        setMatrixText(updatedText);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [type]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-32 h-32';
      case 'fullscreen':
        return 'w-full h-full';
      default:
        return 'w-16 h-16';
    }
  };

  const renderNeuralNetwork = () => (
    <div className={`relative ${getSizeClasses()}`}>
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Nodes */}
        {[
          { x: 50, y: 50, delay: 0 },
          { x: 150, y: 50, delay: 0.2 },
          { x: 100, y: 100, delay: 0.4 },
          { x: 50, y: 150, delay: 0.6 },
          { x: 150, y: 150, delay: 0.8 },
        ].map((node, index) => (
          <motion.circle
            key={index}
            cx={node.x}
            cy={node.y}
            r="6"
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        ))}

        {/* Connections */}
        {[
          { x1: 50, y1: 50, x2: 150, y2: 50, delay: 0.1 },
          { x1: 50, y1: 50, x2: 100, y2: 100, delay: 0.3 },
          { x1: 150, y1: 50, x2: 100, y2: 100, delay: 0.5 },
          { x1: 100, y1: 100, x2: 50, y2: 150, delay: 0.7 },
          { x1: 100, y1: 100, x2: 150, y2: 150, delay: 0.9 },
        ].map((line, index) => (
          <motion.line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0.5] }}
            transition={{
              duration: 3,
              delay: line.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        ))}
      </svg>
    </div>
  );

  const renderMatrix = () => (
    <div className={`relative ${getSizeClasses()} overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg">
        {matrixText.map((line, index) => (
          <motion.div
            key={index}
            className="text-xs font-mono whitespace-nowrap"
            style={{
              color: color,
              fontSize: size === 'small' ? '6px' : size === 'large' ? '10px' : '8px',
              lineHeight: size === 'small' ? '8px' : size === 'large' ? '12px' : '10px',
            }}
            animate={{
              y: [-20, 300],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: index * 0.1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderParticleFlow = () => (
    <div className={`relative ${getSizeClasses()}`}>
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: '50%',
            top: '50%',
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
          animate={{
            x: [0, Math.cos(index * 30 * (Math.PI / 180)) * 40],
            y: [0, Math.sin(index * 30 * (Math.PI / 180)) * 40],
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: index * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  const renderBrainwave = () => (
    <div className={`relative ${getSizeClasses()}`}>
      <svg className="w-full h-full" viewBox="0 0 200 100">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.path
            key={index}
            d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={0.8 - index * 0.2}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
            animate={{
              d: [
                "M0,50 Q25,20 50,50 T100,50 T150,50 T200,50",
                "M0,50 Q25,80 50,50 T100,50 T150,50 T200,50",
                "M0,50 Q25,20 50,50 T100,50 T150,50 T200,50",
              ],
            }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );

  const renderOrbit = () => (
    <div className={`relative ${getSizeClasses()}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </div>
      
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="relative w-full h-full">
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: color,
                left: `${50 + (20 + index * 8) * Math.cos(0)}%`,
                top: `${50 + (20 + index * 8) * Math.sin(0)}%`,
                filter: `drop-shadow(0 0 4px ${color})`,
                opacity: 0.8 - index * 0.2,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderGlitch = () => (
    <div className={`relative ${getSizeClasses()}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent rounded-lg"
        style={{ color }}
        animate={{
          x: [-100, 100, -50, 150, 0],
          scaleX: [1, 0.5, 1.5, 0.8, 1],
          opacity: [0, 0.8, 0, 0.9, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute inset-2 border-2 rounded-lg"
        style={{ borderColor: color }}
        animate={{
          borderWidth: ['2px', '4px', '1px', '3px'],
          opacity: [0.3, 1, 0.5, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-0.5 rounded"
          style={{
            backgroundColor: color,
            top: `${20 + index * 15}%`,
          }}
          animate={{
            scaleX: [0, 1, 0.3, 1, 0],
            opacity: [0, 1, 0.2, 0.8, 0],
          }}
          transition={{
            duration: 1,
            delay: index * 0.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  const renderAnimation = () => {
    switch (type) {
      case 'neural':
        return renderNeuralNetwork();
      case 'matrix':
        return renderMatrix();
      case 'particle':
        return renderParticleFlow();
      case 'brainwave':
        return renderBrainwave();
      case 'orbit':
        return renderOrbit();
      case 'glitch':
        return renderGlitch();
      default:
        return renderNeuralNetwork();
    }
  };

  const containerClasses = `
    ${overlay ? 'fixed inset-0 z-50' : 'relative'}
    ${overlay ? 'bg-black/20 backdrop-blur-md' : ''}
    ${size === 'fullscreen' ? 'w-screen h-screen' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className={`
        ${overlay || size === 'fullscreen' ? 'absolute inset-0' : 'relative'}
        flex flex-col items-center justify-center
        ${overlay ? 'bg-surface-1/10 backdrop-blur-xl rounded-2xl border border-white/10' : ''}
      `}>
        <div className="flex items-center justify-center mb-4">
          {renderAnimation()}
        </div>

        {showProgress && typeof progress === 'number' && (
          <div className="w-32 mb-4">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Loading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-1 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{
                  background: `linear-gradient(90deg, ${color}80, ${color})`,
                  filter: `drop-shadow(0 0 4px ${color})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {(overlay || size === 'fullscreen') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary text-sm font-medium"
          >
            Processing...
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Loading = LoadingAnimation;