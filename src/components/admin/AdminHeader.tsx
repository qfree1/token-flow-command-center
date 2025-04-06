
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <div className="flex justify-center mb-8">
        <motion.div className="relative w-16 h-16">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-70"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
            <Shield className="h-7 w-7 text-purple-400" />
          </div>
        </motion.div>
      </div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-center mb-2 glow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Admin Control Panel
      </motion.h1>
      <motion.p 
        className="text-muted-foreground text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Manage and allocate Web3D tokens to user wallets
      </motion.p>
    </motion.div>
  );
};

export default AdminHeader;
