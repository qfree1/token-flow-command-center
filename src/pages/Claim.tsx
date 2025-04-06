
import React, { useState, useEffect } from 'react';
import { connectWallet, checkTokenAllocation, claimTokens } from '../services/web3';
import { motion } from 'framer-motion';
import { Wallet, Check, AlertTriangle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Header from '../components/Header';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Claim = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [allocation, setAllocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Check if user has allocation
      const tokenAmount = await checkTokenAllocation(address);
      setAllocation(tokenAmount);
      
      if (!tokenAmount) {
        toast({
          title: "No Allocation Found",
          description: "Your wallet does not have any tokens allocated for claiming",
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

  const handleClaimTokens = async () => {
    if (!walletAddress || !allocation) return;
    
    setLoading(true);
    try {
      const success = await claimTokens(walletAddress);
      if (success) {
        setClaimed(true);
        setAllocation(null);
        toast({
          title: "Success",
          description: `Successfully claimed your tokens!`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Claim Failed",
        description: "Failed to claim tokens. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold glow-text">Web3D Token Claim</h1>
          <p className="text-muted-foreground mt-2">
            Connect your wallet to claim your allocated Web3D tokens
          </p>
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
                  <Wallet className="h-6 w-6" />
                  Wallet Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!walletAddress ? (
                  <Button 
                    onClick={handleConnectWallet}
                    className="w-full gradient-bg hover:opacity-90 transition-opacity"
                  >
                    Connect MetaMask
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted text-center break-all">
                      <p className="text-sm text-muted-foreground">Connected Wallet</p>
                      <p>{walletAddress}</p>
                    </div>
                    
                    {allocation ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center"
                      >
                        <p className="text-green-400">Tokens Available to Claim</p>
                        <p className="text-xl font-bold mt-1">{allocation} Web3D</p>
                      </motion.div>
                    ) : claimed ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 text-center"
                      >
                        <p className="text-blue-400">Tokens Successfully Claimed!</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center"
                      >
                        <p className="text-red-400">No Tokens to Claim</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This wallet has no token allocation
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
              {allocation && walletAddress && (
                <CardFooter>
                  <Button 
                    onClick={handleClaimTokens}
                    className="w-full gradient-bg hover:opacity-90 transition-opacity"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Claim Tokens
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Link to="/" className="text-primary hover:underline">
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
            <p>Network: Binance Smart Chain (BSC)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
