
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { connectWallet, checkIfAdmin } from '../../services/web3';
import WalletConnect from '../../components/WalletConnect';
import TokenForm from '../../components/TokenForm';
import { toast } from '@/hooks/use-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import PasswordAuth from '../../components/admin/PasswordAuth';
import AdminInfo from '../../components/admin/AdminInfo';
import LockedContent from '../../components/admin/LockedContent';

const AdminPassword = "123456";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <AdminHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WalletConnect 
            address={walletAddress} 
            onConnect={handleConnect}
            isAdmin={isAdmin}
          />
          
          {!isAuthenticated && !isAdmin && (
            <PasswordAuth 
              onAuthenticated={handleAuthentication} 
              adminPassword={AdminPassword}
            />
          )}
          
          <AdminInfo />
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
              <LockedContent />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
