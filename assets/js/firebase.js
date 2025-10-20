// /assets/js/firebase.js  (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updatePassword as fbUpdatePassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection, doc, setDoc, getDoc, addDoc, getDocs, query, where,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
// (Optional) Analytics — safe to keep imported only on pages where you want it
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPiVMybOjwYZmcpu0DJdYcZp8Exmvia2k",
  authDomain: "dustins-universe.firebaseapp.com",
  projectId: "dustins-universe",
  storageBucket: "dustins-universe.firebasestorage.app",
  messagingSenderId: "626645730907",
  appId: "1:626645730907:web:ca2151bbb85c6044e2617e",
  measurementId: "G-PPYZ56S7XX"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // enable on public pages if you want
const auth = getAuth(app);
const db = getFirestore(app);

// Expose helpers the rest of the site uses
window.fb = {
  auth, db,
  onAuth: (cb) => onAuthStateChanged(auth, cb),
  signIn: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
  signOut: () => fbSignOut(auth),
  updatePassword: (newPass) => fbUpdatePassword(auth.currentUser, newPass),
  createUser: (email, pass) => createUserWithEmailAndPassword(auth, email, pass),

  // Firestore helpers
  c: (path) => collection(db, path),
  d: (path, id) => doc(db, path, id),
  add: (path, data) => addDoc(collection(db, path), data),
  set: (path, id, data) => setDoc(doc(db, path, id), data, { merge: true }),
  get: (path, id) => getDoc(doc(db, path, id)),
  getDocs: (col) => getDocs(col),
  q: (path, field, op, value) => query(collection(db, path), where(field, op, value)),
};

// Tiny UI error helper many pages use
window.showError = (id, msg) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = false; el.textContent = msg;
};
