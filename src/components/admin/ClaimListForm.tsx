
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ClipboardList, Loader, CheckCircle, AlertCircle, Bug } from 'lucide-react';
import TokenProgressIndicator from '../token/TokenProgressIndicator';
import { setClaimList, CLAIM_CONTRACT_ADDRESS } from '@/services/web3';
import Web3 from 'web3';

interface ClaimListFormProps {
  disabled: boolean;
}

const ClaimListForm: React.FC<ClaimListFormProps> = ({ disabled }) => {
  const [walletList, setWalletList] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalWallets, setTotalWallets] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debug, setDebug] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setSuccess(false);
    setErrorMessage(null);
    
    if (!walletList.trim() || !tokenAmount.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const wallets = walletList
      .split(',')
      .map(wallet => wallet.trim())
      .filter(wallet => wallet.length > 0);
    
    if (wallets.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one wallet address",
        variant: "destructive"
      });
      return;
    }

    const invalidWallets = wallets.filter(wallet => !wallet.startsWith('0x') || wallet.length !== 42);
    if (invalidWallets.length > 0) {
      toast({
        title: "Error",
        description: "Some wallet addresses are invalid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSuccess(false);
    setTransferring(true);
    setTotalWallets(wallets.length);
    setProcessedCount(0);
    
    try {
      // Create an array with the same amount for all wallets
      const amounts = wallets.map(() => tokenAmount);
      
      console.log("Setting claim list for wallets:", wallets);
      console.log("With token amount:", tokenAmount);
      
      // Show progress as we prepare transaction
      setCurrentWallet('Preparing transaction...');
      
      // Call the contract method to set claim list
      await setClaimList(wallets, amounts);
      
      // Update progress to show completion
      setProcessedCount(wallets.length);
      setCurrentWallet('Transaction completed!');
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form
      setWalletList('');
      setTokenAmount('');
      
      toast({
        title: "Success",
        description: `Claim list set for ${wallets.length} wallets`,
        variant: "default"
      });
    } catch (error: any) {
      console.error("Claim list setting error:", error);
      
      // Set error message for display
      setErrorMessage(error.message || "Failed to set claim list");
      
      toast({
        title: "Error",
        description: error.message || "Failed to set claim list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setTransferring(false);
      setCurrentWallet(null);
    }
  };

  const toggleDebug = () => {
    setDebug(!debug);
  };

  // Function to format wei value with explanation
  const formatWeiAmount = (amount: string): string => {
    try {
      const web3Instance = new Web3();
      const weiValue = web3Instance.utils.toWei(amount, 'ether');
      return `${amount} Web3D (${weiValue} wei)`;
    } catch (error) {
      return `${amount} Web3D`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-card w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <ClipboardList className="h-6 w-6" />
              </motion.div>
              Set Claim List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="walletList">Wallet Addresses (comma separated)</Label>
              <Textarea
                id="walletList"
                placeholder="0x123...,0x456..."
                value={walletList}
                onChange={(e) => setWalletList(e.target.value)}
                disabled={disabled || loading}
                className="min-h-[100px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Each address must start with 0x and be 42 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenAmount">Token Amount (per wallet)</Label>
              <Input
                id="tokenAmount"
                type="text"
                placeholder="100"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                disabled={disabled || loading}
              />
              <p className="text-xs text-muted-foreground">
                Amount of Web3D tokens each wallet can claim (1 Web3D = 10<sup>18</sup> wei)
              </p>
            </div>
            
            <TokenProgressIndicator
              transferring={transferring}
              currentWallet={currentWallet}
              processedCount={processedCount}
              totalWallets={totalWallets}
            />
            
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-sm">
                <p className="font-medium text-red-500 mb-1">Error:</p>
                <p className="text-red-400">{errorMessage}</p>
              </div>
            )}
            
            {debug && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-md p-3 text-xs font-mono">
                <p className="font-medium text-slate-400 mb-1">Debug Info:</p>
                <p>Contract Address: {CLAIM_CONTRACT_ADDRESS}</p>
                <p>Network: BSC Mainnet</p>
                <p>Token Amount: {tokenAmount ? formatWeiAmount(tokenAmount) : '0 Web3D'}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={toggleDebug} 
                className="text-xs"
              >
                <Bug className="h-3 w-3 mr-1" />
                {debug ? 'Hide Debug' : 'Debug'}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <motion.div 
              whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
              whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
              className="w-full"
            >
              {success ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex gap-2 items-center justify-center"
                  disabled={true}
                >
                  <CheckCircle className="h-5 w-5" />
                  Claim List Set Successfully
                </Button>
              ) : loading ? (
                <Button
                  className="w-full gradient-bg opacity-80 flex gap-2 items-center justify-center"
                  disabled={true}
                >
                  <Loader className="h-5 w-5 animate-spin" />
                  Setting Claim List...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full gradient-bg hover:opacity-90 transition-opacity flex gap-2 items-center justify-center"
                  disabled={disabled}
                >
                  {disabled ? (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      Connect Admin Wallet First
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-5 w-5" />
                      Set Claim List
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default ClaimListForm;
