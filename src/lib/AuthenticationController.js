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
        this.userData = writable(null);

        this.firebaseCtrl.auth.onAuthStateChanged(u => {
            this.#onAuthStateChanged(u);
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
    #onAuthStateChanged(newUser) {
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
     * Change personal info.
     * @param {"student" | "teacher" | "unset"} type
     */
    async setAccountType(type) {
        const user = get(this.user);
        if ((user === null) || (user == "loggedOut")) {
            return; // ??
        }

        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");
        const document = doc(usersRef, user.uid);
        const update = {
            accountType: type,
        };

        await setDoc(document, update, { merge: true });
        await this.userDataCacheCtrl.fetchUserData(user.uid);
    }

    /**
     * Change personal info.
     * @param {UserData} data
     */
    async setUserData(data) {
        const user = get(this.user);
        if ((user === null) || (user == "loggedOut")) {
            return; // ??
        }

        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");
        const document = doc(usersRef, user.uid);
        const update = {
            accountType: data.accountType,
            username: data.username,
            bio: data.bio
        };

        await setDoc(document, update);
        await this.userDataCacheCtrl.fetchUserData(user.uid);
    }
}

export class UserData {
    /**
     * @param {"student" | "teacher" | "unset"} accountType
     * @param {string} username
     * @param {string} bio
     * @param {string} degree
     */
    constructor(accountType, username, bio, degree) {
        this.accountType = accountType;
        this.username = username;
        this.bio = bio;
        this.degree = degree;
    }

    /**
     * @param {"student" | "teacher" | "unset"} accountType
     * @returns {UserData}
     */
    withType(accountType) {
        return new UserData(accountType, this.username, this.bio, this.degree);
    }

    /**
     * @param {string} username
     * @returns {UserData}
     */
    withUsername(username) {
        return new UserData(this.accountType, username, this.bio, this.degree);
    }

    /**
     * @param {string} bio
     * @returns {UserData}
     */
    withBio(bio) {
        return new UserData(this.accountType, this.username, bio, this.degree);
    }

    /**
     * @param {string} degree
     * @returns {UserData}
     */
    withDegree(degree) {
        return new UserData(this.accountType, this.username, this.bio, degree);
    }

    /**
     * @returns {string}
     */
    formattedAccountType() {
        switch (this.accountType) {
            case "student": return "Student";
            case "teacher": return "Teacher";
            case "unset": return "Unset";
        }
    }
}

