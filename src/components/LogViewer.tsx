import React from 'react';
import { LogEntry } from '../types';
import { Activity, Clock, User, Fingerprint, Link as LinkIcon, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogViewerProps {
  logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-[#f5f5f0] text-[#5A5A40] rounded-2xl flex items-center justify-center mb-4 opacity-50">
          <Activity size={32} />
        </div>
        <h3 className="font-serif font-bold text-xl text-[#1a1a1a] mb-2">No activity recorded</h3>
        <p className="text-sm text-[#5A5A40]/60 max-w-xs">System events and data mutations will be logged in this immutable ledger.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#1a1a1a]">Audit Trail</h2>
          <p className="text-xs text-[#5A5A40] uppercase tracking-widest mt-1">Immutable Log Records (Simulated Blockchain)</p>
        </div>
        <div className="px-4 py-2 bg-[#f5f5f0] rounded-full border border-[#5A5A40]/10 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-tighter">Chain Integrity Verified</span>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-6 before:top-8 before:bottom-8 before:w-0.5 before:bg-[#5A5A40]/10">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="group flex gap-6 p-5 rounded-3xl border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all hover:bg-white hover:shadow-xl hover:shadow-[#5A5A40]/5 relative bg-[#fcfcfc]"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm",
              log.action === 'UPLOAD' ? "bg-blue-100 text-blue-600" :
              log.action === 'SHARE' ? "bg-purple-100 text-purple-600" :
              log.action === 'LOGIN' ? "bg-green-100 text-green-600" :
              log.action === 'LOGOUT' ? "bg-slate-100 text-slate-600" :
              "bg-orange-100 text-orange-600"
            )}>
              {getActionIcon(log.action)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">{log.action}</span>
                <span className="text-[10px] text-[#5A5A40] font-mono flex items-center gap-1">
                  <Clock size={10} />
                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                </span>
              </div>
              
              <p className="text-sm text-[#5A5A40] mb-4 font-medium">{log.details}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-[#f5f5f0] rounded-xl p-2 border border-[#5A5A40]/5">
                  <p className="text-[8px] uppercase tracking-widest text-[#5A5A40]/60 font-bold mb-1">Block Hash (Current)</p>
                  <p className="text-[10px] font-mono text-[#1a1a1a] break-all">{log.blockHash || 'N/A'}</p>
                </div>
                <div className="bg-[#f5f5f0] rounded-xl p-2 border border-[#5A5A40]/5">
                  <p className="text-[8px] uppercase tracking-widest text-[#5A5A40]/60 font-bold mb-1">Previous Hash (Link)</p>
                  <p className="text-[10px] font-mono text-[#1a1a1a] break-all">{log.prevHash || 'None'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <MetadataItem icon={<User size={10} />} label="User UID" value={log.userId.substring(0, 8) + '...'} />
                {log.cid && <MetadataItem icon={<Fingerprint size={10} />} label="CID" value={log.cid.substring(0, 8) + '...'} />}
                <div className="ml-auto flex items-center gap-1 text-[9px] font-bold text-[#5A5A40] uppercase tracking-tight">
                  <ShieldCheck size={12} className="text-green-600" />
                  Immutable
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getActionIcon(action: string) {
  switch (action) {
    case 'UPLOAD': return <Activity size={24} />;
    case 'SHARE': return <ShieldCheck size={24} />;
    case 'LOGIN': return <User size={24} />;
    case 'LOGOUT': return <LogOut size={24} />;
    default: return <Activity size={24} />;
  }
}

function MetadataItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-[#5A5A40]/10 shadow-sm">
      <span className="text-[#5A5A40]">{icon}</span>
      <span className="text-[9px] uppercase font-bold text-[#5A5A40]/60">{label}:</span>
      <span className="text-[9px] font-mono text-[#5A5A40]">{value}</span>
    </div>
  );
}
