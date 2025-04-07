
import React, { useState } from 'react';
import { connectWallet, checkClaimableAmount, claimTokens } from '../services/web3';
import { motion } from 'framer-motion';
import { Wallet, ChevronLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ClaimCard from '@/components/claim/ClaimCard';

const Claim = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please make sure MetaMask is installed and unlocked.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute top-10 right-10 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
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
          className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"
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

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <motion.div 
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
                  <Coins className="h-7 w-7 text-purple-400" />
                </div>
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold glow-text">Web3D Token Claim</h1>
            <p className="text-muted-foreground mt-2">
              Connect your wallet to claim your allocated Web3D tokens
            </p>
          </motion.div>
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!walletAddress ? (
              <div className="text-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleConnectWallet}
                    className="gradient-bg hover:opacity-90 transition-opacity px-8 py-6 text-lg"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet to Claim
                  </Button>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="bg-muted/30 border border-muted/30 rounded-lg p-4 text-center max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
                  <p className="font-mono text-sm break-all">{walletAddress}</p>
                </div>
                
                <ClaimCard walletAddress={walletAddress} />
              </>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Link to="/admin" className="inline-flex items-center text-primary hover:underline">
              <motion.div
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
              </motion.div>
              Go to Admin Dashboard
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            <p>Web3D Token Contract: 0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7</p>
            <p>Claim Contract: {process.env.CLAIM_CONTRACT_ADDRESS || "Not deployed yet"}</p>
            <p>Network: Binance Smart Chain (BSC)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
