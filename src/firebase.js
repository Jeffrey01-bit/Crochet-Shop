import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace these placeholders with the actual config values from the user's project
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "project-328991118467.firebaseapp.com",
    projectId: "project-328991118467",
    storageBucket: "project-328991118467.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
