// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyolxxonmLbCUUB9DgOR-1rD3HYoS8U00",
  authDomain: "docheck-bd7c2.firebaseapp.com",
  projectId: "docheck-bd7c2",
  storageBucket: "docheck-bd7c2.appspot.com",
  messagingSenderId: "322997418614",
  appId: "1:322997418614:web:de45ad692a995e5be23d57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configuración de persistencia de autenticación (opcional)
// setPersistence(auth, browserLocalPersistence);

export {
  auth,
  db,
  storage,
  // Auth functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  // Firestore functions
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  setDoc
};