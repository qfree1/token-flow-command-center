
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { connectWallet, checkIfAdmin } from '../../services/web3';
import WalletConnect from '../../components/WalletConnect';
import TokenForm from '../../components/TokenForm';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ChevronLeft, LockKeyhole, Database, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPassword = "123456";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Check if wallet is admin
      const adminStatus = await checkIfAdmin(address);
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        toast({
          title: "Access Denied",
          description: "This wallet does not have admin privileges",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Admin Wallet Connected",
          description: "Welcome back, Admin",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const handlePasswordAuth = () => {
    if (password === AdminPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Welcome to Admin Panel",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="flex justify-center mb-8">
          <motion.div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-70"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
              <Shield className="h-7 w-7 text-purple-400" />
            </div>
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-2 glow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Admin Control Panel
        </motion.h1>
        <motion.p 
          className="text-muted-foreground text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Manage and allocate Web3D tokens to user wallets
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WalletConnect 
            address={walletAddress} 
            onConnect={handleConnect}
            isAdmin={isAdmin}
          />
          
          {!isAuthenticated && !isAdmin && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <LockKeyhole className="h-5 w-5" />
                    Password Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted/50"
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handlePasswordAuth}
                      className="w-full gradient-bg hover:opacity-90 transition-opacity"
                    >
                      Authenticate
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Database className="h-5 w-5" />
                  Admin Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Admin Wallet: 0xcaE2D679961bd3e7501E9a48a9f820521bE6d1eE</p>
                <p>Web3D Token: 0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7</p>
                <p>Network: Binance Smart Chain (BSC)</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link to="/claim">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Go to Claim Page
                    </Button>
                  </motion.div>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {(isAdmin || isAuthenticated) ? (
              <TokenForm walletAddress={walletAddress || ""} />
            ) : (
              <Card className="glass-card h-full flex flex-col justify-center items-center py-16">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <LockKeyhole className="h-16 w-16 text-muted-foreground/30" />
                </motion.div>
                <p className="mt-6 text-muted-foreground">
                  Connect with admin wallet or authenticate with password to access the token management panel
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
