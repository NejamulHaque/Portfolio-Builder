import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrw2y8TfVf7OlYMVuygYXiOJ6MZgjQkec",
  authDomain: "portfolio-builderr.firebaseapp.com",
  projectId: "portfolio-builderr",
  storageBucket: "portfolio-builderr.firebasestorage.app",
  messagingSenderId: "487334111173",
  appId: "1:487334111173:web:db1308967b37b7c64bcdac",
  measurementId: "G-V9KGSFELLF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
