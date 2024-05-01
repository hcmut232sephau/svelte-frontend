import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { writable, get } from 'svelte/store';
import { FirebaseController } from "./FirebaseController";
import { UserDataCacheController } from "./UserDataCacheController";

export class AuthenticationController {
    /**
     * Firebase user auth.
     * @type {import("svelte/store").Writable<import("@firebase/auth").User | "loggedOut" | null>}
     */
    user;

    /**
     * Account data.
     * @type {import("svelte/store").Writable<UserData | null>}
     */
    userData;

    #unsubscribeUserDataCache;

    /**
     * @param {FirebaseController} firebaseCtrl
     * @param {UserDataCacheController} userDataCacheCtrl;
     */
    constructor(firebaseCtrl, userDataCacheCtrl) {
        this.firebaseCtrl = firebaseCtrl;
        this.userDataCacheCtrl = userDataCacheCtrl;

        this.user = writable(null);
        this.isRegistering = writable(false);
        this.userData = writable(null);

        this.firebaseCtrl.auth.onAuthStateChanged(u => {
            this.onAuthStateChanged(u);
        });
        this.#unsubscribeUserDataCache = this.userDataCacheCtrl.cache.subscribe(e => {
            const user = get(this.user);
            if (user !== null && user != "loggedOut") {
                this.userData.set(e.get(user.uid) ?? null);
            }
        });
    }

    destroy() {
        this.#unsubscribeUserDataCache();
    }

    /**
     * @param {import("@firebase/auth").User | null} newUser
     */
    onAuthStateChanged(newUser) {
        if (newUser === null) {
            this.user.set("loggedOut");
            this.userData.set(null);
        } else {
            this.user.set(newUser);
            this.userDataCacheCtrl.fetchUserData(newUser.uid);
        }
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
     * @param {"student" | "teacher"} type
     */
    async changeAccountType(type) {
        const user = get(this.user);
        if ((user === null) || (user == "loggedOut")) {
            return; // ??!!
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
     * @param {string} name
     */
    async setUsername(name) {
        const user = get(this.user);
        if ((user === null) || (user == "loggedOut")) {
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

        this.userData.update(e => e?.withUsername(name) ?? null);
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

