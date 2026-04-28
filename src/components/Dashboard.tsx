import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db, collection, query, where, getDocs, onSnapshot, orderBy } from '../lib/firebase';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { LogViewer } from './LogViewer';
import { FileItem, LogEntry } from '../types';
import { Box, History, LayoutDashboard, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'logs'>('files');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Listen for files owned by me
    const filesQuery = query(
      collection(db, 'files'), 
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(filesQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FileItem));
      setFiles(items);
    }, (error) => {
      console.error("Firestore Files error:", error);
    });

    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    const logsQuery = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      setLogs(items);
    }, (error) => {
      console.error("Firestore Logs error:", error);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-3xl p-6 border border-[#5A5A40]/10 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#5A5A40] mb-4">Management</p>
          <nav className="space-y-2">
            <TabButton 
              active={activeTab === 'files'} 
              onClick={() => setActiveTab('files')}
              icon={<LayoutDashboard size={20} />}
              label="My Vault"
            />
            <TabButton 
              active={activeTab === 'logs'} 
              onClick={() => setActiveTab('logs')}
              icon={<History size={20} />}
              label="Audit Trail"
            />
          </nav>
        </div>

        <FileUpload user={user} />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl border border-[#5A5A40]/10 shadow-sm min-h-[500px] overflow-hidden">
          {activeTab === 'files' ? (
            <FileList user={user} files={files} />
          ) : (
            <LogViewer logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm",
        active 
          ? "bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" 
          : "text-[#5A5A40] hover:bg-[#5A5A40]/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
