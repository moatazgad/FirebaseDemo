import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authdomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
};

/// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "movies");

// // get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     // console.log(snapshot.docs)
//     let movies = [];
//     snapshot.docs.forEach((doc) => {
//       movies.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(movies);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// queries
const q = query(colRef, orderBy("createdAt"));

// realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  let movies = [];
  snapshot.docs.forEach((doc) => {
    movies.push({ ...doc.data(), id: doc.id });
  });
  console.log(movies);
});

// adding docs
const addMovieForm = document.querySelector(".add");
addMovieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addMovieForm.title.value,
    author: addMovieForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addMovieForm.reset();
  });
});

// deleting docs
const deleteMovieForm = document.querySelector(".delete");
deleteMovieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "movies", deleteMovieForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteMovieForm.reset();
  });
});

// fetching a single document (& realtime)
const docRef = doc(db, "movies", "SS1Fj6hTfIUuW7nVOqnR");

// getDoc(docRef)
//   .then(doc => {
//     console.log(doc.data(), doc.id)
//   })

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let docRef = doc(db, "movies", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //   console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      //   console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //   console.log("user logged in:", cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
