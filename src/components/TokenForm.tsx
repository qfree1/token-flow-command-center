
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Check, Loader, Users, Coins, Send, Lock } from 'lucide-react';

interface TokenFormProps {
  onSubmit: (wallets: string[], amount: string) => Promise<void>;
  disabled: boolean;
}

const TokenForm: React.FC<TokenFormProps> = ({ onSubmit, disabled }) => {
  const [walletList, setWalletList] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalWallets, setTotalWallets] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Set up event listeners for transfer progress
      window.addEventListener('tokenTransferProgress', ((event: CustomEvent) => {
        const { wallet, count, total } = event.detail;
        setCurrentWallet(wallet);
        setProcessedCount(count);
        console.log(`Transfer progress: ${count}/${total} - Current: ${wallet}`);
      }) as EventListener);
      
      await onSubmit(wallets, tokenAmount);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form
      setWalletList('');
      setTokenAmount('');
      
      toast({
        title: "Success",
        description: `Tokens transferred to ${wallets.length} wallets`,
        variant: "default"
      });
      
      // Log to confirm transfer was completed
      console.log(`Transferred ${tokenAmount} tokens to ${wallets.length} wallets`);
    } catch (error) {
      console.error("Token transfer error:", error);
      toast({
        title: "Error",
        description: "Failed to transfer tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setTransferring(false);
      setCurrentWallet(null);
      window.removeEventListener('tokenTransferProgress', (() => {}) as EventListener);
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
                <Send className="h-6 w-6" />
              </motion.div>
              Transfer Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wallets" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Wallet List (comma-separated)
              </Label>
              <Textarea
                id="wallets"
                placeholder="0x1234...,0x5678..."
                value={walletList}
                onChange={(e) => setWalletList(e.target.value)}
                className="min-h-[100px] bg-background border-input focus-visible:ring-purple-500"
                disabled={disabled || loading}
              />
              <p className="text-xs text-muted-foreground">Add wallet addresses separated by commas</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                Token Amount (per wallet)
              </Label>
              <Input
                id="amount"
                placeholder="100"
                type="number"
                min="0"
                step="0.000001"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                disabled={disabled || loading}
                className="bg-background border-input focus-visible:ring-purple-500"
              />
              <p className="text-xs text-muted-foreground">Specify how many tokens each wallet will receive</p>
            </div>
            
            {transferring && (
              <div className="space-y-2 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-400">Transfer Progress:</span>
                  <span className="text-sm font-medium text-blue-400">{processedCount}/{totalWallets}</span>
                </div>
                <div className="w-full bg-blue-950/50 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" 
                       style={{ width: `${totalWallets ? (processedCount / totalWallets) * 100 : 0}%` }}></div>
                </div>
                {currentWallet && (
                  <p className="text-xs text-blue-400/70 truncate">Current: {currentWallet}</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <motion.div 
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              className="w-full"
            >
              <Button 
                type="submit" 
                className="w-full gradient-bg hover:opacity-90 transition-opacity"
                disabled={disabled || loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    {transferring ? 'Transferring...' : 'Processing...'}
                  </>
                ) : success ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Tokens Transferred!
                  </>
                ) : (
                  <>
                    {disabled ? (
                      <motion.div 
                        animate={{ x: [0, 2, 0, -2, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Lock className="h-5 w-5 mr-2" />
                      </motion.div>
                    ) : (
                      <Send className="h-5 w-5 mr-2" />
                    )}
                    Transfer Tokens
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default TokenForm;
