import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQaFDln-NWxDWzLCVaRVVS92NJXVvRHQ8",
  authDomain: "orizinal-app-login.firebaseapp.com",
  projectId: "orizinal-app-login",
  storageBucket: "orizinal-app-login.appspot.com",
  messagingSenderId: "51790579",
  appId: "1:51790579:web:68de909bb562286cfced86",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };
