
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface TokenProgressIndicatorProps {
  transferring: boolean;
  currentWallet: string | null;
  processedCount: number;
  totalWallets: number;
}

const TokenProgressIndicator: React.FC<TokenProgressIndicatorProps> = ({
  transferring,
  currentWallet,
  processedCount,
  totalWallets
}) => {
  if (!transferring) return null;

  return (
    <div className="space-y-2 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
      <div className="flex justify-between items-center">
        <span className="text-sm text-blue-400">Transfer Progress:</span>
        <span className="text-sm font-medium text-blue-400">{processedCount}/{totalWallets}</span>
      </div>
      <div className="w-full bg-blue-950/50 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${totalWallets ? (processedCount / totalWallets) * 100 : 0}%` }}
        />
      </div>
      {currentWallet && (
        <p className="text-xs text-blue-400/70 truncate">Current: {currentWallet}</p>
      )}
    </div>
  );
};

export default TokenProgressIndicator;
