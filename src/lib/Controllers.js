import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, connectAuthEmulator } from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

import { writable, get } from 'svelte/store';

export class FirebaseController {
    constructor() {
        const useEmulator = false;

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
        this.auth = getAuth(this.app);
        if (useEmulator) {
            connectAuthEmulator(this.auth, "http://127.0.0.1:9099");
        }
        this.db = getFirestore(this.app);
        if (useEmulator) {
            connectFirestoreEmulator(this.db, "127.0.0.1", 8080);
        }
    }
}

export class ApplicationController {
    /**
     * Firebase user auth.
     * @type {import("svelte/store").Writable<import("@firebase/auth").User | null>} 
     */
    user;

    /**
     * UI state.
     * @type {import("svelte/store").Writable<boolean>} 
     */
    isRegistering;

    /**
     * Account state.
     * @type {import("svelte/store").Writable<"student" | "teacher" | "admin" | null>}
     */
    accountType;

    constructor() {
        this.firebaseCtrl = new FirebaseController();

        this.user = writable(null);
        this.isRegistering = writable(false);
        this.accountType = writable(null);

        this.firebaseCtrl.auth.onAuthStateChanged((u) => {
            this.onAuthStateChanged(u);
        });
    }

    /**
     * @param {import("@firebase/auth").User | null} newUser
     */
    onAuthStateChanged(newUser) {
        if (newUser != null && this.accountType == null) {
            const db = this.firebaseCtrl.db;
            const usersRef = collection(db, "users");
            getDoc(doc(usersRef, newUser.uid)).then(e => {
                const currentAccountType = e.get("accountType");
                if (currentAccountType === undefined) {
                    this.accountType.set(null);
                } else {
                    this.accountType.set(currentAccountType);
                }
                return e;
            });
        }
        this.user.set(newUser);
    }

    switchToRegistering() {
        this.isRegistering.set(true);
    }

    switchToLogin() {
        this.isRegistering.set(false);
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

    /**
     * Change the account type by writing to Firestore.
     * CANNOT be used to change to admin.
     * @param {"student" | "teacher"} type
     */
    async changeAccountType(type) {
        const user = get(this.user);
        if (user == null) {
            return; // ??
        }

        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");
        return await setDoc(doc(usersRef, user.uid), {
            accountType: type,
        }).then(e => {
            this.accountType.set(type);
            return e;
        }).catch(e => {
            console.log(e);
        });
    }
}