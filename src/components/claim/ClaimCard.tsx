
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Coins, Check, Loader, AlertTriangle } from 'lucide-react';
import { checkClaimableAmount, claimTokens, getClaimStatus } from '@/services/web3';

interface ClaimCardProps {
  walletAddress: string | null;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ walletAddress }) => {
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkClaim = async () => {
      if (!walletAddress) return;
      
      setCheckingStatus(true);
      try {
        // Check if already claimed
        const claimStatus = await getClaimStatus(walletAddress);
        setClaimed(claimStatus);
        
        if (!claimStatus) {
          // Check available amount
          const amount = await checkClaimableAmount(walletAddress);
          setClaimableAmount(amount);
          
          if (amount === "0") {
            toast({
              title: "No Allocation Found",
              description: "Your wallet does not have any tokens allocated for claiming",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Allocation Found",
              description: `You have ${amount} Web3D tokens available to claim`,
            });
          }
        }
      } catch (error) {
        console.error("Error checking claim:", error);
        toast({
          title: "Error Checking Claim",
          description: "Failed to check your claim status. Please try again.",
          variant: "destructive"
        });
      } finally {
        setCheckingStatus(false);
      }
    };
    
    if (walletAddress) {
      checkClaim();
    }
  }, [walletAddress, toast]);

  const handleClaim = async () => {
    if (!walletAddress || !claimableAmount || Number(claimableAmount) === 0) return;
    
    setLoading(true);
    try {
      const success = await claimTokens(walletAddress);
      
      if (success) {
        setClaimed(true);
        setClaimableAmount("0");
        toast({
          title: "Success",
          description: `Successfully claimed your tokens!`,
        });
      }
    } catch (error: any) {
      console.error("Error claiming tokens:", error);
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim tokens. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6"
    >
      <Card className="glass-card w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Coins className="h-6 w-6" />
            </motion.div>
            Claim Status
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {checkingStatus ? (
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Loader className="h-8 w-8 text-amber-400 animate-spin" />
              </div>
              <p className="text-amber-400">Checking your claim status...</p>
            </div>
          ) : claimed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center"
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
              <p className="text-xs text-blue-400/70 mt-1">
                Your Web3D tokens have been transferred to your wallet
              </p>
            </motion.div>
          ) : claimableAmount && Number(claimableAmount) > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="flex justify-center mb-2"
              >
                <Coins className="h-8 w-8 text-green-400" />
              </motion.div>
              <p className="text-green-400">Tokens Available to Claim</p>
              <p className="text-xl font-bold mt-1">{claimableAmount} Web3D</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center"
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
        </CardContent>
        
        {claimableAmount && Number(claimableAmount) > 0 && (
          <CardFooter>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button 
                onClick={handleClaim}
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
  );
};

export default ClaimCard;
