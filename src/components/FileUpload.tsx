import React, { useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { uploadToIPFS } from '../services/ipfsService';
import { db, collection, addDoc, serverTimestamp, logEvent } from '../lib/firebase';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { formatBytes } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  user: User;
}

export function FileUpload({ user }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to IPFS
      const ipfsData = await uploadToIPFS(file);
      const cid = ipfsData.IpfsHash;

      // 2. Save metadata to Firestore
      await addDoc(collection(db, 'files'), {
        cid,
        name: file.name,
        size: file.size,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        type: file.type || 'application/octet-stream'
      });

      // 3. Log event
      await logEvent('UPLOAD', user.uid, `File "${file.name}" uploaded to IPFS`, { cid });

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#5A5A40]/10 shadow-sm space-y-4">
      <p className="text-[10px] uppercase tracking-widest text-[#5A5A40]">Secure Upload</p>
      
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#5A5A40]/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#5A5A40]/40 transition-colors group"
        >
          <div className="w-12 h-12 bg-[#f5f5f0] text-[#5A5A40] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]">Choose a file</p>
          <p className="text-xs text-[#5A5A40]/60 mt-1">Up to 10MB per file</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#f5f5f0] rounded-2xl relative">
            <div className="w-10 h-10 bg-[#5A5A40] text-white rounded-lg flex items-center justify-center">
              <File size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] truncate">{file.name}</p>
              <p className="text-xs text-[#5A5A40]">{formatBytes(file.size)}</p>
            </div>
            <button 
              disabled={uploading}
              onClick={() => setFile(null)}
              className="p-1 hover:bg-[#5A5A40]/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#5A5A40] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                Upload to IPFS
              </>
            )}
          </button>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-2 text-xs border border-red-100"
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
