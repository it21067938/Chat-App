import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDisfTr0Fk5yrHJ24CJSg0qvsynILrMTAw",
  authDomain: "chatt-app-183cb.firebaseapp.com",
  projectId: "chatt-app-183cb",
  storageBucket: "chatt-app-183cb.firebasestorage.app",
  messagingSenderId: "184410331213",
  appId: "1:184410331213:web:bf60cfa709f99dbea4e404",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Login and Signup
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There i am using TalkLoop",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "chat", user.uid), {
      chatData: [],
    });
    toast.success("User Added Successfully");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Successfully Logging");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    toast.success("Logout Successfully");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

export { signUp, login, logOut, auth, db };
