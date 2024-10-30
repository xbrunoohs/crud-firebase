const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBhEX_0f1zjtT-l_FC7BiIGb9v7DkvuKWE",
  authDomain: "crud-firebase-9b61c.firebaseapp.com",
  projectId: "crud-firebase-9b61c",
  storageBucket: "crud-firebase-9b61c.firebasestorage.app",
  messagingSenderId: "20318769254",
  appId: "1:20318769254:web:c311ec36a144ad38c0dda7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = db;

