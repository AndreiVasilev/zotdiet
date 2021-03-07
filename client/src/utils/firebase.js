import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBpaWeXds28Z68-uUv7w_9BZlCKG9HxBOc",
  authDomain: "zotdiet-302203.firebaseapp.com",
  databaseURL: "https://zotdiet-302203-default-rtdb.firebaseio.com",
  projectId: "zotdiet-302203",
  storageBucket: "zotdiet-302203.appspot.com",
  messagingSenderId: "545961353765",
  appId: "1:545961353765:web:d95c13361b99176a3015cc",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
export default firebase;
