import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyATx963e-2lJX-3Ln6yBVDrOiPK6BCkD14",
  authDomain: "click-manager.firebaseapp.com",
  databaseURL: "https://click-manager-default-rtdb.firebaseio.com",
  projectId: "click-manager",
  storageBucket: "click-manager.appspot.com",
  messagingSenderId: "82728559577",
  appId: "1:82728559577:web:149e18f2e57d27aeae2fc8",
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
