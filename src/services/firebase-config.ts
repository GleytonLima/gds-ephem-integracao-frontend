// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCosFwdKTNVZhhOXbaqzSVRh4rw4Ml5Q8s",
  authDomain: "gds-ephem-integration-frontend.firebaseapp.com",
  projectId: "gds-ephem-integration-frontend",
  storageBucket: "gds-ephem-integration-frontend.appspot.com",
  messagingSenderId: "869472217536",
  appId: "1:869472217536:web:275245878251731e1b0025",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);
export { auth };
