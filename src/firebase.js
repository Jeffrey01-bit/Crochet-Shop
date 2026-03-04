import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace these placeholders with the actual config values from the user's project
const firebaseConfig = {
    apiKey: "AIzaSyAziJf0ITjnoY5XtHr1SERqRVkeF7Fjkhs",
    authDomain: "crochet-shop-b5fd3.firebaseapp.com",
    projectId: "crochet-shop-b5fd3",
    storageBucket: "crochet-shop-b5fd3.firebasestorage.app",
    messagingSenderId: "328991118467",
    appId: "1:328991118467:web:e40c0149237ecac2dcf7b6",
    measurementId: "G-G3Q1Q2MTWW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
