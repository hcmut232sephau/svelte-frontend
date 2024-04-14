import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, connectAuthEmulator } from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

import { writable, get } from 'svelte/store';

export class FirebaseController {
    constructor() {
        const useEmulator = true;

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

export class UserData {
    /**
     * @type {"student" | "teacher" | "unselected"}
     */
    accountType;

    /**
     * @type {string}
     */
    username;

    /**
     * @param {"student" | "teacher" | "unselected"} accountType 
     * @param {string} username 
     */
    constructor(accountType, username) {
        this.accountType = accountType;
        this.username = username;
    }

    /**
     * @param {"student" | "teacher" | "unselected"} accountType
     * @returns {UserData}
     */
    withType(accountType) {
        return new UserData(accountType, this.username);
    }
    
    /**
     * @param {string} username 
     * @returns {UserData}
     */
    withUsername(username) {
        return new UserData(this.accountType, username);
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
     * Account data.
     * @type {import("svelte/store").Writable<UserData | null>}
     */
    userData;

    constructor() {
        this.firebaseCtrl = new FirebaseController();

        this.user = writable(null);
        this.isRegistering = writable(false);
        this.userData = writable(null);

        this.firebaseCtrl.auth.onAuthStateChanged((u) => {
            this.onAuthStateChanged(u);
        });
    }

    /**
     * @param {import("@firebase/auth").User | null} newUser
     */
    onAuthStateChanged(newUser) {
        this.user.set(newUser);

        // Sync account type
        if (newUser === null) {
            this.userData.set(null);
        } else {
            let currentUserData = get(this.userData);
            if (currentUserData === null) {
                const db = this.firebaseCtrl.db;
                const usersRef = collection(db, "users");
                getDoc(doc(usersRef, newUser.uid)).then(e => {
                    console.log(e.get("accountType") + " ;;; " + e.get("username"));

                    let accountType;
                    const currentAccountType = e.get("accountType");
                    if (currentAccountType === undefined) {
                        accountType = "unselected";
                    } else {
                        accountType = currentAccountType;
                    }
    
                    let username = "";
                    const currentUsername = e.get("username");
                    if (currentUsername === undefined) {
                        // Empty string for unset username
                        username = "";
                    } else {
                        username = currentUsername;
                    }

                    console.log(new UserData(accountType, username));

                    this.userData.set(new UserData(accountType, username));

                    return e;
                });
            }
        }
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
        const document = doc(usersRef, user.uid);
        const update = {
            accountType: type,
        };
        
        try {
            await updateDoc(document, update);
        } catch {
            await setDoc(document, update);
        }

        this.userData.update(e => {
            if (e == null) {
                return e;
            }
            return e.withType(type);
        });
    }

    /**
     * Change the account username.
     * CANNOT be used to change to admin.
     * @param {string} name
     */
    async setUsername(name) {
        const user = get(this.user);
        if (user == null) {
            return; // ??
        }

        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");
        const document = doc(usersRef, user.uid);
        const update = {
            username: name,
        };
        
        try {
            await updateDoc(document, update);
        } catch {
            await setDoc(document, update);
        }

        this.userData.update(e => {
            if (e == null) {
                return e;
            }
            return e.withUsername(name);
        });
    }
}