// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDuzbRzDEQmLwfmit3Sz1vql5NzO0W9MI",
  authDomain: "askmeanything-6ef52.firebaseapp.com",
  projectId: "askmeanything-6ef52",
  storageBucket: "askmeanything-6ef52.firebasestorage.app",
  messagingSenderId: "955205790111",
  appId: "1:955205790111:web:996a3905732efee4e0f5aa",
  measurementId: "G-3XJFEW8QJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const  auth= getAuth(app)
const db = getFirestore(app);


export {app, auth, db}