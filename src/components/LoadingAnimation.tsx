
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [lettersVisible, setLettersVisible] = useState(false);
  
  // Animation will run once on component mount
  useEffect(() => {
    setTimeout(() => {
      setLettersVisible(true);
    }, 1000);
    
    // Complete animation after 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      y: -50,
      opacity: 0,
      scale: 0.5
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const title = "Chat with Aura";
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* AI glow effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-xl scale-150 animate-pulse"></div>
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
            className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center"
          >
            <div className="text-indigo-600 text-4xl font-bold">AI</div>
          </motion.div>
        </motion.div>
        
        {/* Dropping letters animation */}
        <motion.div
          className="flex items-center space-x-2 mt-4"
          variants={containerVariants}
          initial="hidden"
          animate={lettersVisible ? "visible" : "hidden"}
        >
          {title.split('').map((letter, i) => (
            letter === " " ? (
              <div key={i} className="w-3"></div>
            ) : (
              <motion.div
                key={i}
                variants={letterVariants}
                className="text-4xl md:text-6xl font-bold text-white"
              >
                {letter}
              </motion.div>
            )
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="mt-6 text-white text-xl"
        >
          Your intelligent assistant
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
