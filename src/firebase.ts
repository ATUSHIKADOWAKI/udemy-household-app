// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQWKhBkaHsA3HhKlhc5OF3Fpk-RhclTX0",
    authDomain: "household-app-5cfee.firebaseapp.com",
    projectId: "household-app-5cfee",
    storageBucket: "household-app-5cfee.firebasestorage.app",
    messagingSenderId: "311824711851",
    appId: "1:311824711851:web:eb86156978c50e227577ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};