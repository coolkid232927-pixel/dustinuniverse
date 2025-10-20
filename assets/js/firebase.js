// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Load Firebase v10 modules via CDN (dynamic import to keep HTML simple)
(async () => {
  const appMod = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js");
  const authMod = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
  const fsMod   = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

  const app  = appMod.initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db   = fsMod.getFirestore(app);

  // Firestore convenience
  const c = (path) => fsMod.collection(db, path);
  const d = (path, id) => fsMod.doc(db, path, id);

  window.fb = {
    auth, db,
    onAuth(cb){ authMod.onAuthStateChanged(auth, cb); },
    signIn(email, pass){ return authMod.signInWithEmailAndPassword(auth, email, pass); },
    signOut(){ return authMod.signOut(auth); },
    updatePassword(newPass){ return authMod.updatePassword(auth.currentUser, newPass); },
    createUser(email, pass){ return authMod.createUserWithEmailAndPassword(auth, email, pass); },

    // Firestore helpers
    c, d,
    add: (path, data) => fsMod.addDoc(c(path), data),
    set: (path, id, data) => fsMod.setDoc(d(path, id), data, { merge: true }),
    get: (path, id) => fsMod.getDoc(d(path, id)),
    getDocs: (col) => fsMod.getDocs(col),
    q: (path, field, op, value) => fsMod.query(c(path), fsMod.where(field, op, value)),
  };

  // Small helper available globally
  window.showError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return; el.hidden = false; el.textContent = msg;
  };
})();
