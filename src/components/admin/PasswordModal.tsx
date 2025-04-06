
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Lock, Key } from 'lucide-react';

interface PasswordModalProps {
  onAuthenticate: () => void;
  visible: boolean;
}

const PasswordModal = ({ onAuthenticate, visible }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      onAuthenticate();
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

  return (
    <AnimatePresence>
      {visible && (
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
  );
};

export default PasswordModal;
