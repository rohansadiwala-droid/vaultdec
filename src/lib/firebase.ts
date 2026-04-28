import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, serverTimestamp, onSnapshot, orderBy, limit } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { generateBlockHash } from './utils';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function logEvent(action: string, userId: string, details: string, extra: any = {}) {
  const logsRef = collection(db, 'logs');
  const lastLogQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(1));
  const lastLogSnap = await getDocs(lastLogQuery);
  
  const prevHash = lastLogSnap.empty ? '00000000' : (lastLogSnap.docs[0].data().blockHash || '00000000');
  
  const logData = {
    action,
    userId,
    details,
    timestamp: serverTimestamp(),
    prevHash,
    ...extra
  };

  const blockHash = generateBlockHash({ ...logData, t: Date.now() });
  
  return addDoc(logsRef, {
    ...logData,
    blockHash
  });
}

export { 
  collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, serverTimestamp, onSnapshot, orderBy,
  signInWithPopup, signOut 
};
