import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { writable } from 'svelte/store';

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
    /**
     * @type {import("svelte/store").Writable<import("@firebase/auth").User | null>} 
     */
    user;
    isRegistering;

    constructor() {
        this.firebaseCtrl = new FirebaseController();

        this.user = writable(null);
        this.isRegistering = writable(false);

        this.firebaseCtrl.auth.onAuthStateChanged((u) => {
            this.onAuthStateChanged(u);
        });
    }

    /**
     * @param {import("@firebase/auth").User | null} newUser
     */
    onAuthStateChanged(newUser) {
        this.user.update((_) => newUser);
    }

    switchToRegistering() {
        this.isRegistering.update(() => true);
    }

    switchToLogin() {
        this.isRegistering.update(() => false);
    }

    /**
     * @param {string} email
     * @param {string} password
     */
    async register(email, password) {
        return await createUserWithEmailAndPassword(this.firebaseCtrl.auth, email, password);
    }

    /**
     * @param {string} email
     * @param {string} password
     */
    async login(email, password) {
        return await signInWithEmailAndPassword(this.firebaseCtrl.auth, email, password);
    }

    async logout() {
        signOut(this.firebaseCtrl.auth);
    }
}