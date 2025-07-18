import React from 'react';
import { motion } from 'framer-motion';

const WaterWaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* SVG Wave Animation */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 0.15)" />
            <stop offset="100%" stopColor="rgba(219, 234, 254, 0.2)" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.05)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 0.08)" />
            <stop offset="100%" stopColor="rgba(219, 234, 254, 0.12)" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.03)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 0.05)" />
            <stop offset="100%" stopColor="rgba(219, 234, 254, 0.08)" />
          </linearGradient>
        </defs>
        
        {/* Wave Layer 1 - Deepest */}
        <motion.path
          d="M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z"
          fill="url(#waveGradient1)"
          animate={{
            d: [
              "M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z",
              "M0,420 C300,370 600,470 900,420 C1050,395 1150,445 1200,420 L1200,800 L0,800 Z",
              "M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Wave Layer 2 - Middle */}
        <motion.path
          d="M0,450 C200,400 500,500 800,450 C950,425 1100,475 1200,450 L1200,800 L0,800 Z"
          fill="url(#waveGradient2)"
          animate={{
            d: [
              "M0,450 C200,400 500,500 800,450 C950,425 1100,475 1200,450 L1200,800 L0,800 Z",
              "M0,470 C200,420 500,520 800,470 C950,445 1100,495 1200,470 L1200,800 L0,800 Z",
              "M0,450 C200,400 500,500 800,450 C950,425 1100,475 1200,450 L1200,800 L0,800 Z"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Wave Layer 3 - Surface */}
        <motion.path
          d="M0,500 C250,450 550,550 850,500 C1000,475 1150,525 1200,500 L1200,800 L0,800 Z"
          fill="url(#waveGradient3)"
          animate={{
            d: [
              "M0,500 C250,450 550,550 850,500 C1000,475 1150,525 1200,500 L1200,800 L0,800 Z",
              "M0,520 C250,470 550,570 850,520 C1000,495 1150,545 1200,520 L1200,800 L0,800 Z",
              "M0,500 C250,450 550,550 850,500 C1000,475 1150,525 1200,500 L1200,800 L0,800 Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </svg>
      
      {/* Floating Bubbles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 30 + 10}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
      
      {/* Subtle Ripple Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute rounded-full border border-white/20"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            left: `${20 + i * 15}%`,
            bottom: `${15 + i * 5}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default WaterWaveBackground;