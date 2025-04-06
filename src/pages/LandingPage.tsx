
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins, Shield, Wallet, ChevronRight, LockKeyhole, ExternalLink } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute top-10 left-10 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          className="flex justify-between items-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/lovable-uploads/6357ffde-af06-41f1-9813-fe22200611fb.png" 
              alt="Web3D Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold glow-text bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Web3D Token Platform
            </h1>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            <Link to="/claim" className="text-white hover:text-purple-400 transition-colors">Claim</Link>
            <Link to="/admin" className="text-white hover:text-purple-400 transition-colors">Admin</Link>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-16">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Manage & Claim </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Web3D Tokens</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              The secure and efficient platform for Web3D token distribution and claiming on Binance Smart Chain.
            </p>
            
            {/* BSC Logo */}
            <div className="flex items-center gap-3 py-4">
              <motion.div 
                className="flex items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <img 
                  src="/lovable-uploads/2e0f3653-10d2-4040-8ec7-a5ff9e777abe.png" 
                  alt="BSC Logo" 
                  className="h-10 w-10"
                />
                <span className="ml-2 font-medium">BSC Network</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-64 h-64 md:w-80 md:h-80"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-70 blur-lg" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-80 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/55c1fa87-ffb2-4f0e-bb39-ec887581cc35.png" 
                  alt="Web3D Token" 
                  className="w-24 h-24 rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Large Claim Button */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/claim">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-70 blur-md -z-10"></div>
              
              {/* Button */}
              <Button 
                size="lg" 
                className="gradient-bg text-xl md:text-2xl py-8 px-12 rounded-xl shadow-lg neo-button gap-3"
              >
                <Coins className="w-8 h-8" />
                CLAIM WEB3D TOKENS
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            {
              icon: <Wallet className="h-8 w-8 text-purple-400" />,
              title: "Easy Token Claiming",
              description: "Connect your wallet and claim your allocated Web3D tokens in just a few clicks."
            },
            {
              icon: <Shield className="h-8 w-8 text-pink-400" />,
              title: "Secure Administration",
              description: "Admin panel with secure wallet authentication for token distribution management."
            },
            {
              icon: <Coins className="h-8 w-8 text-blue-400" />,
              title: "BSC Compatibility",
              description: "Built for Binance Smart Chain, ensuring fast and low-cost transactions."
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="glass-card p-6 rounded-xl"
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(157, 23, 210, 0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="mb-4 p-3 inline-block rounded-full bg-background"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contract Info */}
        <motion.div
          className="glass-card p-6 rounded-xl max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">Contract Information</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/2e0f3653-10d2-4040-8ec7-a5ff9e777abe.png" 
                alt="BSC Logo" 
                className="h-8 w-8 mr-2"
              />
              <span>Binance Smart Chain</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">Contract: 
                <span className="ml-1 text-purple-400 hover:text-pink-400 transition-colors">
                  0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7
                </span>
              </span>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                transition={{ duration: 0.2 }}
                className="ml-1 cursor-pointer"
                onClick={() => window.open(`https://bscscan.com/address/0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer with Admin Access */}
        <motion.div
          className="text-center pt-4 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link to="/admin">
            <motion.div 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <LockKeyhole className="h-4 w-4 mr-1" />
              Admin Access
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
