import React from 'react';
import { Shield, Lock, Share2, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onLogin: () => void;
  error?: string | null;
}

export function Landing({ onLogin, error }: LandingProps) {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-24 h-24 bg-[#5A5A40] rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl"
      >
        <Lock size={48} />
      </motion.div>
      
      <h2 className="text-5xl sm:text-7xl font-serif font-bold text-[#1a1a1a] mb-6 leading-tight">
        Your Files, <br />
        <span className="italic text-[#5A5A40]">Truly Decentralized</span>
      </h2>
      
      <p className="max-w-xl text-[#5A5A40] text-lg mb-8">
        A peer-to-peer file sharing system powered by IPFS with robust access control and immutable blockchain-style audit logs via Firebase.
      </p>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded-2xl mb-8 text-sm max-w-md"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
        <FeatureCard 
          icon={<Database size={24} />}
          title="IPFS Storage"
          description="Files are pinned to the InterPlanetary File System for eternal availability."
        />
        <FeatureCard 
          icon={<Shield size={24} />}
          title="Access Control"
          description="Fine-grained permissions stored securely in Firestore."
        />
        <FeatureCard 
          icon={<Share2 size={24} />}
          title="Audit Logs"
          description="Every upload and access event is recorded in an immutable ledger."
        />
      </div>

      <button 
        onClick={onLogin}
        className="bg-[#5A5A40] text-white px-12 py-4 rounded-2xl text-lg font-bold hover:bg-[#4a4a35] transition-all shadow-2xl hover:scale-105"
      >
        Get Started for Free
      </button>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-[#5A5A40]/10 shadow-sm text-left">
      <div className="w-12 h-12 bg-[#f5f5f0] text-[#5A5A40] rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-serif font-bold text-xl text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-sm text-[#5A5A40]/80 leading-relaxed">{description}</p>
    </div>
  );
}
