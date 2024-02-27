import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
apiKey: "AIzaSyC0c-xJax8apfw3pm0fvrQ67si2C3Nl90o",
authDomain: "student-d5207.firebaseapp.com",
projectId: "student-d5207",
storageBucket: "student-d5207.appspot.com",
messagingSenderId: "652013039815",
appId: "1:652013039815:web:0a8f2cbe78940565e00ee2",
measurementId: "G-FXEPKK91HQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db=getFirestore(app);
export const storage= getStorage(app);