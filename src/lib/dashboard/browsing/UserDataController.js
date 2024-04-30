import { get, writable } from "svelte/store";
import { AuthenticationController, UserData } from "$lib/AuthenticationController";
import { collection, doc, getDoc } from "firebase/firestore";

export class UserDataController {
    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<UserData | null>}
     */
    data;

    /**
     * @param {AuthenticationController} authCtrl
     * @param {string} id
     */
    constructor(authCtrl, id) {
        this.authCtrl = authCtrl;
        this.data = writable(null);
        this.id = id;

        console.log("get user data");
        this.#getData().then(e => {
            this.data.set(e);
            console.log("set user data", e);
        });
    }

    destroy() {
        // TODO
    }

    /**
     * @returns {Promise<UserData>}
     */
    async #getData() {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to get courses while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const usersRef = collection(db, "users");

        let fetchedDoc = await getDoc(doc(usersRef, this.id));

        let accountType;
        const currentAccountType = fetchedDoc.get("accountType");
        if (currentAccountType === undefined) {
            accountType = "unselected";
        } else {
            accountType = currentAccountType;
        }

        let username = "";
        const currentUsername = fetchedDoc.get("username");
        if (currentUsername === undefined) {
            // Empty string for unset username
            username = "";
        } else {
            username = currentUsername;
        }

        return new UserData(accountType, username);
    }
}