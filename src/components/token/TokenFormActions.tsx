
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader, Check, Send, Lock } from 'lucide-react';

interface TokenFormActionsProps {
  loading: boolean;
  success: boolean;
  disabled: boolean;
  transferring: boolean;
}

const TokenFormActions: React.FC<TokenFormActionsProps> = ({
  loading,
  success,
  disabled,
  transferring
}) => {
  return (
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
  );
};

export default TokenFormActions;
