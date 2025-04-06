
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../../components/Header';

const AdminHeader = () => {
  return (
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
  );
};

export default AdminHeader;
