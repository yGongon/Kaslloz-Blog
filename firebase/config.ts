import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYV2pnEWJ4YhhvrCbd7Y17wOG2oU3eSpU",
  authDomain: "delta-force-ops-hub.firebaseapp.com",
  databaseURL: "https://delta-force-ops-hub-default-rtdb.firebaseio.com",
  projectId: "delta-force-ops-hub",
  storageBucket: "delta-force-ops-hub.firebasestorage.app",
  messagingSenderId: "147769895385",
  appId: "1:147769895385:web:a511f7e90a79d8e1c4d1c8",
  measurementId: "G-L60HF4B4Y0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
