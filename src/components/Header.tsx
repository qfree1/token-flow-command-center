
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
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
