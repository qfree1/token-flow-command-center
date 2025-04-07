
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import TokenFormFields from './token/TokenFormFields';
import TokenProgressIndicator from './token/TokenProgressIndicator';
import TokenFormActions from './token/TokenFormActions';

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
            <TokenFormFields
              walletList={walletList}
              setWalletList={setWalletList}
              tokenAmount={tokenAmount}
              setTokenAmount={setTokenAmount}
              disabled={disabled || loading}
            />
            
            <TokenProgressIndicator
              transferring={transferring}
              currentWallet={currentWallet}
              processedCount={processedCount}
              totalWallets={totalWallets}
            />
          </CardContent>
          <CardFooter>
            <TokenFormActions
              loading={loading}
              success={success}
              disabled={disabled}
              transferring={transferring}
            />
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default TokenForm;
