import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage, firebaseApp } from 'firebase/storage';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXYiOyr5EOFZ3t8Kr_kWuD7DfZLjvEeOk",
    authDomain: "yours-223a7.firebaseapp.com",
    projectId: "yours-223a7",
    storageBucket: "yours-223a7.appspot.com",
    messagingSenderId: "55992865817",
    appId: "1:55992865817:web:47a582b0b76fe649398688",
    measurementId: "G-9JYKR1KPVQ"
  };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(firebaseApp, "gs://yours-223a7.appspot.com");
export { auth, db, app,storage };
