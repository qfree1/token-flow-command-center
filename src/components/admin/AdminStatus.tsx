
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface AdminStatusProps {
  isAdmin: boolean;
}

const AdminStatus = ({ isAdmin }: AdminStatusProps) => {
  return (
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
            Admin Wallet: 0x4A58ad9EdaC24762D3eA8eB76ab1E2C114cBB4d4
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStatus;
