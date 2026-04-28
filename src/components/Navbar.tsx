import React from 'react';
import { User } from 'firebase/auth';
import { LogOut, Shield, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-[#5A5A40]/20 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#1a1a1a] leading-none">D-Vault</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#5A5A40]">Decentralized Access</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-[#1a1a1a]">{user.displayName}</span>
                <span className="text-[10px] text-[#5A5A40] uppercase tracking-wider">{user.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-[#5A5A40]/10 rounded-lg transition-colors text-[#5A5A40]"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-[#5A5A40] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#4a4a35] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
