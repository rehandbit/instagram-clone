import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC8fWxwAIJ_xHVDYXT1J-IFKqw6HcVL3s8",
  authDomain: "instagram01-clone22.firebaseapp.com",
  projectId: "instagram01-clone22",
  storageBucket: "instagram01-clone22.appspot.com",
  messagingSenderId: "851768935908",
  appId: "1:851768935908:web:e03926adba3847a74f33f1",
  measurementId: "G-QSDMMD74MS"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};