import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCowSTE0Fo7SUsmfcijdlokWwqLZY7onkg",
    authDomain: "my-partfolio.firebaseapp.com",
    projectId: "my-partfolio",
    storageBucket: "my-partfolio.firebasestorage.app",
    messagingSenderId: "707128971063",
    appId: "1:707128971063:web:c5d92f2fb840f9843314b2",
    measurementId: "G-25B8TW7K5M"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);