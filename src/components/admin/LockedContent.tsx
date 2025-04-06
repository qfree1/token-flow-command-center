
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';

const LockedContent: React.FC = () => {
  return (
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
  );
};

export default LockedContent;
