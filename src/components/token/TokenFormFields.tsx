
import React from 'react';
import { Users, Coins } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TokenFormFieldsProps {
  walletList: string;
  setWalletList: (value: string) => void;
  tokenAmount: string;
  setTokenAmount: (value: string) => void;
  disabled: boolean;
}

const TokenFormFields: React.FC<TokenFormFieldsProps> = ({
  walletList,
  setWalletList,
  tokenAmount,
  setTokenAmount,
  disabled
}) => {
  return (
    <div className="space-y-6">
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
          disabled={disabled}
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
          disabled={disabled}
          className="bg-background border-input focus-visible:ring-purple-500"
        />
        <p className="text-xs text-muted-foreground">Specify how many tokens each wallet will receive</p>
      </div>
    </div>
  );
};

export default TokenFormFields;
