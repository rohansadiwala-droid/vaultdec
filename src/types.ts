export interface FileItem {
  id: string;
  cid: string;
  name: string;
  size: number;
  ownerId: string;
  createdAt: any;
  type: string;
}

export interface LogEntry {
  id: string;
  action: 'UPLOAD' | 'SHARE' | 'REVOKE' | 'ACCESS' | 'LOGIN' | 'LOGOUT';
  userId: string;
  cid?: string;
  timestamp: any;
  details: string;
  blockHash?: string;
  prevHash?: string;
}

export interface Permission {
  id: string;
  fileId: string;
  grantedTo: string; // email or uid? usually uid for backend, email for UI input
  grantedBy: string;
  grantedAt: any;
}
