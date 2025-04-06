
import React, { useState, useEffect } from 'react';
import { connectWallet, checkTokenAllocation, claimTokens } from '../services/web3';
import { motion } from 'framer-motion';
import { Wallet, Check, AlertTriangle, Loader, Coins, ChevronLeft } from 'lucide-react';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Check if user has allocation
      setLoading(true);
      const tokenAmount = await checkTokenAllocation(address);
      setLoading(false);
      setAllocation(tokenAmount);
      
      if (!tokenAmount) {
        toast({
          title: "No Allocation Found",
          description: "Your wallet does not have any tokens allocated for claiming",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Allocation Found",
          description: `You have ${tokenAmount} Web3D tokens available to claim`,
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
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
        setShowSuccess(true);
        toast({
          title: "Success",
          description: `Successfully claimed your tokens!`,
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
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
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto mb-6"
            >
              <div className="flex gap-3 items-center">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-green-400">Claim Successful!</h3>
                  <p className="text-sm text-green-300/70">Your Web3D tokens have been transferred to your wallet</p>
                </div>
              </div>
            </motion.div>
          )}

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
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleConnectWallet}
                      className="w-full gradient-bg hover:opacity-90 transition-opacity"
                    >
                      Connect MetaMask
                    </Button>
                  </motion.div>
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
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="flex justify-center mb-2"
                        >
                          <Coins className="h-8 w-8 text-green-400" />
                        </motion.div>
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
                        <div className="flex justify-center mb-2">
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                              y: [0, -3, 0]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <Check className="h-8 w-8 text-blue-400" />
                          </motion.div>
                        </div>
                        <p className="text-blue-400">Tokens Successfully Claimed!</p>
                      </motion.div>
                    ) : loading ? (
                      <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-2">
                          <Loader className="h-8 w-8 text-amber-400 animate-spin" />
                        </div>
                        <p className="text-amber-400">Checking allocation...</p>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center"
                      >
                        <div className="flex justify-center mb-2">
                          <motion.div
                            animate={{ 
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ 
                              duration: 1.2, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                          </motion.div>
                        </div>
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
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
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
                  </motion.div>
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
            <p>Network: Binance Smart Chain (BSC)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
