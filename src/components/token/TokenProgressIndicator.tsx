
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
  
  const progressPercentage = totalWallets ? (processedCount / totalWallets) * 100 : 0;

  return (
    <div className="space-y-3 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30 animate-in fade-in">
      <div className="flex items-center gap-2 mb-1">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="h-4 w-4 text-blue-400" />
        </motion.div>
        <h4 className="font-medium text-blue-400">Transfer Progress</h4>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-blue-400">Processing wallets...</span>
        <span className="font-medium text-blue-400">
          {processedCount}/{totalWallets} ({progressPercentage.toFixed(0)}%)
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 bg-blue-950/50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
          style={{ 
            transformOrigin: 'left',
            width: `${progressPercentage}%`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </Progress>
      
      {currentWallet && (
        <div className="text-xs">
          <span className="text-blue-400/70">Current wallet: </span>
          <span className="text-blue-300 font-mono truncate">{currentWallet}</span>
        </div>
      )}
    </div>
  );
};

export default TokenProgressIndicator;
