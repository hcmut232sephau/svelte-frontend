import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

export class FirebaseController {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyD_zMBYqbREwqHXIjl23BJnnYKZgeGTOHM",
            authDomain: "hcmut232sephau.firebaseapp.com",
            projectId: "hcmut232sephau",
            storageBucket: "hcmut232sephau.appspot.com",
            messagingSenderId: "157198175036",
            appId: "1:157198175036:web:3aa247386c867bba4bec39",
            measurementId: "G-BDVJWBYBXM"
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.auth = getAuth();
    }
}

export class ApplicationController {
    constructor() {
        this.firebaseCtrl = new FirebaseController();

        this.isUserRegistering = false;
        this.user = null;

        this.firebaseCtrl.auth.onAuthStateChanged((u) => {
            this.onAuthStateChanged(u);
        });
    }

    /**
     * @param {import("@firebase/auth").User | null} newUser
     */
    onAuthStateChanged(newUser) {
        if (newUser === null) {
            this.user = null;
            // openLoginPage();
            return;
        }

        if (!newUser.emailVerified) {
            // firebase.auth().signOut();
            // openUnverifiedEmailPage();
            return;
        }

        // TODO
        // openDashboardPage();
        this.user = newUser;
    }

    /**
     * @param {string} email
     * @param {string} password
     */
    login(email, password) {
        try {
            firebase.auth().signInWithEmailAndPassword(email, password);
            // From here on `onAuthStateChanged` will carry client logic.
            // No need for async.
        } catch (e) {
            console.log(e);
        }
    }
}