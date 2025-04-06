
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins, Shield, Wallet, ChevronRight, LockKeyhole, Star, ExternalLink } from 'lucide-react';

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

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.header 
          className="flex justify-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/lovable-uploads/55c1fa87-ffb2-4f0e-bb39-ec887581cc35.png" 
              alt="Web3D Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold glow-text bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Web3D Token Platform
            </h1>
          </motion.div>
        </motion.header>

        {/* Hero Section with Larger Claim Token Button */}
        <div className="flex flex-col items-center justify-center gap-8 mb-24 text-center">
          <motion.div 
            className="space-y-6 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Claim Your </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Web3D Tokens</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl">
              Connect your wallet and claim your Web3D tokens on Binance Smart Chain in just a few simple steps.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-lg"
          >
            <Link to="/claim">
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button size="lg" className="w-full py-8 text-xl gradient-bg hover:opacity-90 gap-3 rounded-xl shadow-lg shadow-purple-500/30">
                  <Coins className="w-8 h-8" />
                  Claim Your Tokens Now
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* BSC Network Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center justify-center mb-20"
        >
          <div className="glass-card p-6 rounded-xl max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" 
                alt="BSC Logo" 
                className="w-16 h-16"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Running on Binance Smart Chain</h3>
            <p className="text-muted-foreground">
              Fast transactions with minimal fees on BSC network
            </p>
          </div>
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
              title: "Secure Transactions",
              description: "All token claims are securely processed and verified on the blockchain."
            },
            {
              icon: <Star className="h-8 w-8 text-blue-400" />,
              title: "Token Benefits",
              description: "Access exclusive features and services with your Web3D tokens."
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
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-2">Contract Information</h3>
          <p className="text-sm text-muted-foreground">Web3D Token Contract: 0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7</p>
          <p className="text-sm text-muted-foreground">Network: Binance Smart Chain (BSC)</p>
        </motion.div>
      </div>

      {/* Footer with Admin Access */}
      <footer className="w-full border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2025 Web3D Token Platform. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="https://bscscan.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                BSC Explorer
              </Link>
              
              <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <LockKeyhole className="h-4 w-4" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
