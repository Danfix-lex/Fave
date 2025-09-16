import React from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';

const MusicalBackground = () => {
  // Musical note variants for different animations
  const noteVariants = {
    initial: { 
      y: '100vh', 
      x: 0, 
      rotate: 0,
      opacity: 0 
    },
    animate: (i) => ({
      y: '-10vh',
      x: [0, Math.random() * 100 - 50, 0],
      rotate: [0, Math.random() * 360 - 180, 0],
      opacity: [0, 0.6, 0],
      transition: {
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: i * 0.5,
        ease: "easeInOut"
      }
    })
  };

  // Sound wave variants
  const waveVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: {
      scaleX: 1,
      opacity: [0, 0.3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Floating musical elements
  const floatingElements = [
    { icon: '♪', size: 24, delay: 0 },
    { icon: '♫', size: 32, delay: 1 },
    { icon: '♬', size: 28, delay: 2 },
    { icon: '♩', size: 20, delay: 3 },
    { icon: '♭', size: 26, delay: 4 },
    { icon: '♯', size: 22, delay: 5 },
    { icon: '♪', size: 30, delay: 6 },
    { icon: '♫', size: 18, delay: 7 },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
        }
      }}
    >
      {/* Animated musical notes */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          variants={noteVariants}
          initial="initial"
          animate="animate"
          custom={index}
          style={{
            position: 'absolute',
            left: `${10 + (index * 12)}%`,
            fontSize: `${element.size}px`,
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Sound waves */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={`wave-${index}`}
          variants={waveVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            bottom: `${20 + index * 15}%`,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)`,
            transformOrigin: 'left',
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 200 - 100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Musical staff lines */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={`staff-${index}`}
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ 
            opacity: [0, 0.2, 0],
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: `${30 + index * 8}%`,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Vinyl record effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </motion.div>

      {/* Piano keys effect */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={`key-${index}`}
            animate={{
              height: [20, 60 + Math.random() * 40, 20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              flex: 1,
              background: index % 2 === 0 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.2)',
              margin: '0 1px',
              borderRadius: '2px 2px 0 0',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MusicalBackground;
