import { writable } from "svelte/store";
import { UserData } from "./AuthenticationController";
import { collection, doc, getDoc } from "firebase/firestore";
import { FirebaseController } from "./FirebaseController";

export class UserDataCacheController {
    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<Map<string, UserData>>}
     */
    cache;

    /**
     * @param {FirebaseController} firebaseCtrl
     */
    constructor(firebaseCtrl) {
        this.firebaseCtrl = firebaseCtrl;
        this.cache = writable(new Map());
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async fetchUserData(id) {
        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");
        getDoc(doc(usersRef, id)).then(e => {
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

            this.cache.update(e => {
                e?.set(id, new UserData(accountType, username));
                return e;
            });

            return e;
        });
    }
}