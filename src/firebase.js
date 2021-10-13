// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxs49xOOhtqr1l8oS-6fAS5HzEipV9VW4",
    authDomain: "gacia-sistema.firebaseapp.com",
    projectId: "gacia-sistema",
    storageBucket: "gacia-sistema.appspot.com",
    messagingSenderId: "108840445131",
    appId: "1:108840445131:web:c050e88ff93ac2e609674e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db