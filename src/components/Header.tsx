
import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <div className="flex justify-center mb-4">
        <motion.div className="relative w-20 h-20">
          <motion.div 
            className="absolute inset-0 rounded-full bg-[#8B5CF6]/30 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: 360 
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" } 
            }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src="/lovable-uploads/55c1fa87-ffb2-4f0e-bb39-ec887581cc35.png" 
              alt="Web3D Logo" 
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div className="flex items-center justify-center gap-2 mb-2">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#673AB7] to-[#E91E63] tracking-tight"
          animate={{ 
            textShadow: ["0 0 8px rgba(103, 58, 183, 0.7)", "0 0 15px rgba(233, 30, 99, 0.7)", "0 0 8px rgba(103, 58, 183, 0.7)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Token Flow Command Center
        </motion.h1>
        
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/lovable-uploads/2e0f3653-10d2-4040-8ec7-a5ff9e777abe.png" 
            alt="BSC Logo" 
            className="h-8 w-8"
          />
        </motion.div>
      </motion.div>
      <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
        <Network className="h-4 w-4 text-[#E91E63]" />
        <span>Manage and distribute Web3D tokens securely on BSC</span>
      </p>
    </motion.header>
  );
};

export default Header;
