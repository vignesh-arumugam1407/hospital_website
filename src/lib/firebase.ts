import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn2ePXc2U6VjWcNdSstZqgIjJ2FqMdcs",
  authDomain: "laskmihospital.firebaseapp.com",
  projectId: "laskmihospital",
  storageBucket: "laskmihospital.firebasestorage.app",
  messagingSenderId: "627815625185",
  appId: "1:627815625185:web:67af1cf9a9ca2f792c62a0",
  measurementId: "G-JV8K0PY4RP",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
