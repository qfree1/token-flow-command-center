
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PasswordAuthProps {
  onAuthenticated: () => void;
  adminPassword: string;
}

const PasswordAuth: React.FC<PasswordAuthProps> = ({ onAuthenticated, adminPassword }) => {
  const [password, setPassword] = useState('');

  const handlePasswordAuth = () => {
    if (password === adminPassword) {
      onAuthenticated();
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
  );
};

export default PasswordAuth;
