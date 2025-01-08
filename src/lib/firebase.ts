import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJOkVgQywbkXaLJ2CQulMKjcAG54OKxIk",
  authDomain: "portfolio-a174e.firebaseapp.com",
  projectId: "portfolio-a174e",
  storageBucket: "portfolio-a174e.firebasestorage.app",
  messagingSenderId: "267286459732",
  appId: "1:267286459732:web:346b2f26cb0098d88144c1",
  measurementId: "G-CEG3P6GW42"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);