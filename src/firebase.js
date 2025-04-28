// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyolxxonmLbCUUB9DgOR-1rD3HYoS8U00",
  authDomain: "docheck-bd7c2.firebaseapp.com",
  projectId: "docheck-bd7c2",
  storageBucket: "docheck-bd7c2.appspot.com",
  messagingSenderId: "322997418614",
  appId: "1:322997418614:web:de45ad692a995e5be23d57"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc
};