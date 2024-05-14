import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDFCwIphv7cB4qkwm8ngE1Zed9CXSOGhME",
    authDomain: "skillhub-5df2d.firebaseapp.com",
    projectId: "skillhub-5df2d",
    storageBucket: "skillhub-5df2d.appspot.com",
    messagingSenderId: "916557907888",
    appId: "1:916557907888:web:1073247ec2e8171d153875",
    measurementId: "G-DC1DFMZ9X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);