
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Check, Loader } from 'lucide-react';

interface TokenFormProps {
  onSubmit: (wallets: string[], amount: string) => Promise<void>;
  disabled: boolean;
}

const TokenForm: React.FC<TokenFormProps> = ({ onSubmit, disabled }) => {
  const [walletList, setWalletList] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);

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
    try {
      await onSubmit(wallets, tokenAmount);
      setWalletList('');
      setTokenAmount('');
      toast({
        title: "Success",
        description: "Tokens have been distributed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to distribute tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
            <CardTitle className="text-center text-2xl font-bold">Distribute Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wallets">Wallet List (comma-separated)</Label>
              <Textarea
                id="wallets"
                placeholder="0x1234...,0x5678..."
                value={walletList}
                onChange={(e) => setWalletList(e.target.value)}
                className="min-h-[100px] bg-background border-input"
                disabled={disabled || loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Token Amount</Label>
              <Input
                id="amount"
                placeholder="100"
                type="number"
                min="0"
                step="0.000001"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                disabled={disabled || loading}
                className="bg-background border-input"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full gradient-bg hover:opacity-90 transition-opacity"
              disabled={disabled || loading}
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Check className="h-5 w-5 mr-2" />
              )}
              Claim Tokens
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default TokenForm;
