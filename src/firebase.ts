import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1jk5uOsuuAgXweom2lCGSeIK-aDxGIuY",
  authDomain: "ecoflare-solutions.firebaseapp.com",
  projectId: "ecoflare-solutions",
  storageBucket: "ecoflare-solutions.firebasestorage.app",
  messagingSenderId: "882616965884",
  appId: "1:882616965884:web:eb3316e35e51b1c1b69579",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
