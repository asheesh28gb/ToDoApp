// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRz-Y66hvwjl3XUeIIwSEZky8B-dZ3SpM",
  authDomain: "todo-e940b.firebaseapp.com",
  projectId: "todo-e940b",
  storageBucket: "todo-e940b.appspot.com",
  messagingSenderId: "704149025308",
  appId: "1:704149025308:web:d4630e9527aa48788ea5d9",
  measurementId: "G-BCH92CP6KR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Export firestore database
// It will be imported into your react app whenever it is needed
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth, app};
