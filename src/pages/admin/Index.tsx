
import React, { useState, useEffect } from 'react';
import { connectWallet, isAdminWallet, distributeTokens } from '../../services/web3';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnect from '../../components/WalletConnect';
import TokenForm from '../../components/TokenForm';
import Header from '../../components/Header';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Lock, ChevronLeft, Key, ShieldCheck, ShieldAlert } from 'lucide-react';

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      toast({
        title: "Authentication Successful",
        description: "Welcome to the Admin Panel",
        variant: "default"
      });
    } else {
      setPasswordError(true);
      toast({
        title: "Authentication Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      const admin = isAdminWallet(address);
      setIsAdmin(admin);
      
      if (!admin) {
        toast({
          title: "Access Denied",
          description: "Only the admin wallet can perform actions",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Admin Connected",
          description: "You now have admin access to distribute tokens",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please make sure MetaMask is installed and unlocked.",
        variant: "destructive"
      });
    }
  };

  const handleDistributeTokens = async (wallets: string[], amount: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only the admin wallet can distribute tokens",
        variant: "destructive"
      });
      return;
    }

    try {
      await distributeTokens(wallets, amount);
      toast({
        title: "Success",
        description: `Allocated ${amount} tokens to ${wallets.length} wallets for claiming`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Distribution Failed",
        description: "Failed to allocate tokens. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-purple-500/30">
                <CardHeader className="space-y-1 flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-16 h-16 mb-2">
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-70"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-1 bg-card rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-center">Admin Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Admin Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                          }}
                          className={`pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        <Key className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {passwordError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          Incorrect password. Please try again.
                        </motion.p>
                      )}
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" className="w-full gradient-bg hover:opacity-90 transition-opacity">
                        Authenticate
                      </Button>
                    </motion.div>
                    
                    <div className="text-center">
                      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                        Return to Home
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <Header />
        </motion.div>
        
        {isAuthenticated && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-500/30 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  {isAdmin ? (
                    <ShieldCheck className="h-6 w-6 text-green-400" />
                  ) : (
                    <ShieldAlert className="h-6 w-6 text-amber-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-1">Admin Status</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isAdmin 
                      ? "You have full admin access to manage token distribution." 
                      : "Connect your admin wallet to enable token distribution."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Admin Wallet: 0xcaE2D679961bd3e7501E9a48a9f820521bE6d1eE
                  </p>
                </div>
              </div>
            </motion.div>

            <WalletConnect 
              address={walletAddress} 
              onConnect={handleConnectWallet}
              isAdmin={isAdmin} 
            />
            
            <TokenForm 
              onSubmit={handleDistributeTokens}
              disabled={!isAdmin || !walletAddress} 
            />
            
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
