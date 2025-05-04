// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC6rSdaQYuHkZ2QikTOrDORxePa460Rb_c",
    authDomain: "cochat-cbec2.firebaseapp.com",
    databaseURL: "https://cochat-cbec2-default-rtdb.firebaseio.com",
    projectId: "cochat-cbec2",
    storageBucket: "cochat-cbec2.firebasestorage.app",
    messagingSenderId: "49970901357",
    appId: "1:49970901357:web:f90fa5367c6c153e3e6a64",
    measurementId: "G-H1YGL7K1WC",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};
