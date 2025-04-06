
import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <div className="flex justify-center mb-4">
        <motion.div className="relative w-16 h-16">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-70"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/55c1fa87-ffb2-4f0e-bb39-ec887581cc35.png" 
              alt="Web3D Logo" 
              className="w-8 h-8 rounded-lg"
            />
          </div>
        </motion.div>
      </div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold glow-text"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        Token Flow Command Center
      </motion.h1>
      <p className="text-muted-foreground mt-2">
        Manage and distribute Web3D tokens securely
      </p>
    </motion.header>
  );
};

export default Header;
