import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCowSTE0Fo7SUsmfcijdlokWwqLZY7onkg",
    authDomain: "my-partfolio.firebaseapp.com",
    projectId: "my-partfolio",
    storageBucket: "my-partfolio.firebasestorage.app",
    messagingSenderId: "707128971063",
    appId: "1:707128971063:web:c5d92f2fb840f9843314b2",
    measurementId: "G-25B8TW7K5M",
    databaseURL: "https://my-partfolio-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);
const githubProvider = new GithubAuthProvider();

githubProvider.addScope('user');
githubProvider.setCustomParameters({
    'allow_signup': 'true'
});

export { auth, database, db, githubProvider };