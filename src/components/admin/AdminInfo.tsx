
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminInfo: React.FC = () => {
  return (
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
  );
};

export default AdminInfo;
