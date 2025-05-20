// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAMMTWNNC0RaM8peWtOG37FibvZPYs5yEA",
  authDomain: "prepai-6d331.firebaseapp.com",
  projectId: "prepai-6d331",
  storageBucket: "prepai-6d331.firebasestorage.app",
  messagingSenderId: "486101276429",
  appId: "1:486101276429:web:5fe32478f080c0e43b8244",
  measurementId: "G-QJQ2D1DS5Z"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);