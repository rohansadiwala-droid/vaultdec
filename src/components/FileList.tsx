import React, { useState } from 'react';
import { FileItem } from '../types';
import { User } from 'firebase/auth';
import { File, ExternalLink, Share2, Trash2, ShieldCheck, MoreVertical } from 'lucide-react';
import { formatBytes } from '../lib/utils';
import { getIPFSUrl } from '../services/ipfsService';
import { db, addDoc, collection, serverTimestamp, logEvent } from '../lib/firebase';

interface FileListProps {
  user: User;
  files: FileItem[];
}

export function FileList({ user, files }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-[#f5f5f0] text-[#5A5A40] rounded-2xl flex items-center justify-center mb-4 opacity-50">
          <File size={32} />
        </div>
        <h3 className="font-serif font-bold text-xl text-[#1a1a1a] mb-2">No files yet</h3>
        <p className="text-sm text-[#5A5A40]/60 max-w-xs">Items you upload will appear here with decentralized access controls.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#5A5A40]/5">
      <div className="px-6 py-4 bg-[#f5f5f0]/30 border-b border-[#5A5A40]/5">
        <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">Secure Records ({files.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f0]/20">
            <tr className="text-left">
              <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#5A5A40]">File</th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#5A5A40]">Size</th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#5A5A40]">CID</th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#5A5A40]">Created</th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-[#5A5A40] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5A5A40]/5">
            {files.map((file) => (
              <FileRow key={file.id} file={file} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FileRow({ file, user }: { file: FileItem, user: User }) {
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail) return;
    
    setSharing(true);
    try {
      // Simulate access control record
      await addDoc(collection(db, `files/${file.id}/permissions`), {
        fileId: file.id,
        grantedToEmail: shareEmail,
        grantedBy: user.uid,
        grantedAt: serverTimestamp()
      });

      // Log the share event
      await logEvent('SHARE', user.uid, `Granted access to ${shareEmail} for file "${file.name}"`, { cid: file.cid });

      setShareEmail('');
      setShowShare(false);
      alert('Access granted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to grant access');
    } finally {
      setSharing(false);
    }
  };

  const logAccess = async () => {
    await logEvent('ACCESS', user.uid, `Accessed file "${file.name}" via IPFS gateway`, { cid: file.cid });
  };

  return (
    <>
      <tr className="hover:bg-[#f5f5f0]/30 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#5A5A40]/10 text-[#5A5A40] rounded-lg flex items-center justify-center shrink-0">
              <File size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] truncate max-w-[200px]">{file.name}</p>
              <p className="text-[10px] text-[#5A5A40] truncate max-w-[200px]">{file.type}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-[#5A5A40] whitespace-nowrap">
          {formatBytes(file.size)}
        </td>
        <td className="px-6 py-4">
          <code className="text-[10px] bg-[#f5f5f0] px-2 py-1 rounded border border-[#5A5A40]/10 text-[#5A5A40] font-mono whitespace-nowrap">
            {file.cid.substring(0, 10)}...{file.cid.substring(file.cid.length - 4)}
          </code>
        </td>
        <td className="px-6 py-4 text-sm text-[#5A5A40] whitespace-nowrap">
          {file.createdAt?.toDate ? file.createdAt.toDate().toLocaleDateString() : 'Just now'}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={getIPFSUrl(file.cid)} 
              target="_blank" 
              rel="noreferrer"
              onClick={logAccess}
              className="p-2 hover:bg-[#5A5A40] hover:text-white rounded-lg transition-all text-[#5A5A40]"
              title="View on IPFS"
            >
              <ExternalLink size={16} />
            </a>
            <button 
              onClick={() => setShowShare(!showShare)}
              className="p-2 hover:bg-[#5A5A40] hover:text-white rounded-lg transition-all text-[#5A5A40]"
              title="Share / Permissions"
            >
              <Share2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      {showShare && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-[#f5f5f0]/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs font-bold text-[#5A5A40] whitespace-nowrap flex items-center gap-2">
                <ShieldCheck size={14} /> GRANT ACCESS
              </p>
              <form onSubmit={handleShare} className="flex-1 flex gap-2 w-full">
                <input 
                  type="email" 
                  placeholder="Enter recipient email..."
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[#5A5A40]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-white"
                  required
                />
                <button 
                  type="submit"
                  disabled={sharing}
                  className="bg-[#5A5A40] text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {sharing ? 'Granting...' : 'Grant Access'}
                </button>
              </form>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
