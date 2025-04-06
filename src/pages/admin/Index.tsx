
import React, { useState } from 'react';
import { connectWallet, isAdminWallet, distributeTokens } from '../../services/web3';
import { useToast } from '@/hooks/use-toast';
import WalletConnect from '../../components/WalletConnect';
import TokenForm from '../../components/TokenForm';
import PasswordModal from '../../components/admin/PasswordModal';
import AdminStatus from '../../components/admin/AdminStatus';
import TokenActions from '../../components/admin/TokenActions';
import AdminHeader from '../../components/admin/AdminHeader';

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const { toast } = useToast();

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    setShowPasswordModal(false);
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
      <PasswordModal 
        onAuthenticate={handleAuthenticate} 
        visible={showPasswordModal} 
      />

      <div className="max-w-4xl mx-auto">
        <AdminHeader />
        
        {isAuthenticated && (
          <div className="space-y-8">
            <AdminStatus isAdmin={isAdmin} />

            <WalletConnect 
              address={walletAddress} 
              onConnect={handleConnectWallet}
              isAdmin={isAdmin} 
            />
            
            <TokenForm 
              onSubmit={handleDistributeTokens}
              disabled={!isAdmin || !walletAddress} 
            />
            
            <TokenActions />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
