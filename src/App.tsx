import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, db, collection, query, where, getDocs, addDoc, serverTimestamp, logEvent } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Landing } from './components/Landing';
import { motion, AnimatePresence } from 'motion/react';
import { LogEntry } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
      // Log event
      if (auth.currentUser) {
        await logEvent('LOGIN', auth.currentUser.uid, `${auth.currentUser.email} logged in`);
      }
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site and try again.");
      } else {
        setError(err.message || "Sign in failed. Ensure you have a stable connection.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (user) {
        await logEvent('LOGOUT', user.uid, `${user.email} logged out`);
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard user={user} />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Landing onLogin={handleLogin} error={error} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
