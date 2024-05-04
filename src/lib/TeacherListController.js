import { writable } from "svelte/store";
import { UserData } from "./AuthenticationController";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FirebaseController } from "./FirebaseController";

export class TeacherListController {
    /**
     * Teachers.
     * @type {import("svelte/store").Writable<UserData[] | null>}
     */
    teachers;

    /**
     * @param {FirebaseController} firebaseCtrl
     */
    constructor(firebaseCtrl) {
        this.firebaseCtrl = firebaseCtrl;
        this.teachers = writable(null);

        this.updateTeachers();
    }

    /**
     * @returns {Promise<UserData[]>}
     */
    async #getTeachers() {
        const db = this.firebaseCtrl.db;
        const usersRef = collection(db, "users");

        let q = query(usersRef, where("accountType", "==", "teacher"));
        let docs = await getDocs(q);
        return docs.docs.map(e => {
            let accountType = e.get("accountType") ?? "unset";
            let username = e.get("username") ?? "";
            let bio = e.get("bio") ?? "";
            let degree = e.get("degree") ?? "";
            return new UserData(accountType, username, bio, degree);
        }).filter(e => e.username != "");
    }

    async updateTeachers() {
        return this.#getTeachers().then(e => {
            this.teachers.set(e);
        });
    }
}