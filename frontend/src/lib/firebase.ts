
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXTt7mw5TNnEJqOwXxwdgnVwYnfHaV2lo",
  authDomain: "inventory-system-3a916.firebaseapp.com",
  projectId: "inventory-system-3a916",
  storageBucket: "inventory-system-3a916.firebasestorage.app",
  messagingSenderId: "1082278814085",
  appId: "1:1082278814085:web:1fa92e84612195ba98a4ec",
  measurementId: "G-5N01XMEXX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
