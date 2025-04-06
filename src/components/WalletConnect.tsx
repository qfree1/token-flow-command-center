
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, XCircle } from 'lucide-react';

interface WalletConnectProps {
  address: string | null;
  onConnect: () => void;
  isAdmin: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ address, onConnect, isAdmin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Wallet className="h-6 w-6" />
            </motion.div>
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!address ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onConnect}
                className="w-full gradient-bg hover:opacity-90 transition-opacity"
              >
                Connect MetaMask
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-lg bg-muted text-center break-all"
              >
                <p className="text-sm text-muted-foreground">Connected Wallet</p>
                <p>{address}</p>
              </motion.div>
              
              {isAdmin ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </motion.div>
                  </div>
                  <p className="text-green-400">Admin Access Granted</p>
                  <p className="text-xs text-green-400/70 mt-1">
                    You can now distribute tokens to users
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <XCircle className="h-8 w-8 text-red-400" />
                    </motion.div>
                  </div>
                  <p className="text-red-400">Admin Access Denied</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only the admin wallet can perform actions
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletConnect;
