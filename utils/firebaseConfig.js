// firebaseConfig.js
import { initializeApp } from "@react-native-firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC6rSdaQYuHkZ2QikTOrDORxePa460Rb_c",
  authDomain: "cochat-cbec2.firebaseapp.com",
  projectId: "cochat-cbec2",
  storageBucket: "cochat-cbec2.firebasestorage.app",
  messagingSenderId: "49970901357",
  appId: "1:49970901357:ios:92b0a236b051983d3e6a64",
  measurementId: "G-H1YGL7K1WC",
};

// 이미 초기화되었는지 체크
export const initFirebase = () => {
  try {
    initializeApp(firebaseConfig);
  } catch (err) {
    // 이미 초기화되었으면 무시
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }
};
