
import React, { useState, useEffect } from 'react';
import { connectWallet, isAdminWallet, distributeTokens } from '../services/web3';
import { motion } from 'framer-motion';
import WalletConnect from '../components/WalletConnect';
import TokenForm from '../components/TokenForm';
import Header from '../components/Header';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      const admin = isAdminWallet(address);
      setIsAdmin(admin);
      
      if (!admin) {
        toast({
          title: "Access Denied",
          description: "Only the admin wallet can perform actions",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please make sure MetaMask is installed and unlocked.",
        variant: "destructive"
      });
    }
  };

  const handleDistributeTokens = async (wallets: string[], amount: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only the admin wallet can distribute tokens",
        variant: "destructive"
      });
      return;
    }

    try {
      await distributeTokens(wallets, amount);
      toast({
        title: "Success",
        description: `Distributed ${amount} tokens to ${wallets.length} wallets`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Distribution Failed",
        description: "Failed to distribute tokens. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <div className="space-y-8">
          <WalletConnect 
            address={walletAddress} 
            onConnect={handleConnectWallet}
            isAdmin={isAdmin} 
          />
          
          <TokenForm 
            onSubmit={handleDistributeTokens}
            disabled={!isAdmin || !walletAddress} 
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            <p>Web3D Token Contract: 0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7</p>
            <p>Network: Binance Smart Chain (BSC)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
