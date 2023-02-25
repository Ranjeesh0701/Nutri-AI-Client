import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrWyYmXrnlOLAax2-lhqjQCZKisWmO6Gs",
  authDomain: "nutri-ai.firebaseapp.com",
  projectId: "nutri-ai",
  storageBucket: "nutri-ai.appspot.com",
  messagingSenderId: "89925697240",
  appId: "1:89925697240:web:0cb3c9afde56848577e1ad",
  measurementId: "G-GSJRGHYH60"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();

// const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth };