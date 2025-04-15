// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAr3neUNJ1cvjjjAUO4LQ49Lf1bwYGkAlU",
    authDomain: "cochat-56d81.firebaseapp.com",
    projectId: "cochat-56d81",
    storageBucket: "cochat-56d81.firebasestorage.app",
    messagingSenderId: "240163826847",
    appId: "1:240163826847:web:4a65906e792468e322c6aa",
    measurementId: "G-TLLRQGQ48E",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};
