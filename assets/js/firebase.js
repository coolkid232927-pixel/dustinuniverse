// /assets/js/firebase.js
// Load this on every page with: <script src="/assets/js/firebase.js" type="module"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, signOut as fbSignOut,
  updatePassword as fbUpdatePassword,
  createUserWithEmailAndPassword,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, addDoc, getDocs, query, where,
  onSnapshot, orderBy, limit, writeBatch
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Your project config (unchanged) ---
const firebaseConfig = {
  apiKey: "AIzaSyBPiVMybOjwYZmcpu0DJdYcZp8Exmvia2k",
  authDomain: "dustins-universe.firebaseapp.com",
  projectId: "dustins-universe",
  storageBucket: "dustins-universe.firebasestorage.app",
  messagingSenderId: "626645730907",
  appId: "1:626645730907:web:ca2151bbb85c6044e2617e",
  measurementId: "G-PPYZ56S7XX"
};

// 1) Initialize app BEFORE using it
const app = initializeApp(firebaseConfig);

// 2) Instances
const auth = getAuth(app);
const db   = getFirestore(app);

// 3) Expose a clean helper API
window.fb = {
  app, auth, db,
  // auth
  onAuth: (cb) => onAuthStateChanged(auth, cb),
  signIn: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
  signOut: () => fbSignOut(auth),
  updatePassword: (newPass) => fbUpdatePassword(auth.currentUser, newPass),
  createUser: (email, pass) => createUserWithEmailAndPassword(auth, email, pass),
  signInAnonymously: () => signInAnonymously(auth),

  // firestore base
  c: (path) => collection(db, path),
  d: (path, id) => doc(db, path, id),

  // accepts either a string 'collection' or a collectionRef
  add: (pathOrRef, data) => (typeof pathOrRef === 'string'
      ? addDoc(collection(db, pathOrRef), data)
      : addDoc(pathOrRef, data)),

  set: (path, id, data, opts={ merge:true }) => setDoc(doc(db, path, id), data, opts),
  get: (path, id) => getDoc(doc(db, path, id)),
  getDocs: (colRef) => getDocs(colRef),
  q: (path, field, op, value) => query(collection(db, path), where(field, op, value)),
  onSnapshot, orderBy, limit, writeBatch,
};

// Tiny UI helper
window.showError = (id, msg) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = false;
  el.textContent = msg;
};

console.debug('[firebase] initialized');
