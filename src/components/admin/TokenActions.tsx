
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

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
        className="text-center text-sm text-muted-foreground mt-8"
      >
        <p>Web3D Token Contract: 0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7</p>
        <p>Network: Binance Smart Chain (BSC)</p>
      </motion.div>
    </>
  );
};

export default TokenActions;
