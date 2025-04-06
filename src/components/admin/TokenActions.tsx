
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Key, ExternalLink } from 'lucide-react';

const TOKEN_CONTRACT_ADDRESS = '0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7';

const TokenActions = () => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <Link to="/claim">
          <Button variant="outline" className="hover:bg-primary/10 gap-2">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            >
              <Key className="h-4 w-4" />
            </motion.div>
            Go to Token Claim Page
          </Button>
        </Link>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-muted-foreground mt-8 space-y-2"
      >
        <p>Web3D Token Contract: {TOKEN_CONTRACT_ADDRESS}</p>
        <p>Network: Binance Smart Chain (BSC)</p>
        <a 
          href={`https://bscscan.com/token/${TOKEN_CONTRACT_ADDRESS}`} 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View on BSCScan</span>
        </a>
      </motion.div>
    </>
  );
};

export default TokenActions;
