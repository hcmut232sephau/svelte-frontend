import { get, writable } from "svelte/store";
import { AuthenticationController } from "./AuthenticationController";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { reinterpretCast } from "./TypeTools";

export class CourseController {
    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<{ courseCode: string, courseName: string, owner: string, students: string[], teachers: string[] }[] | null>}
     */
    courses;

    /**
     * @param {AuthenticationController} authCtrl
     */
    constructor(authCtrl) {
        this.authCtrl = authCtrl;
        this.courses = writable(null);

        this.#getCourses().then(e => {
            this.courses.set(e);
        });
    }

    destroy() {
        // TODO
    }

    /**
     * @returns {Promise<{ courseCode: string, courseName: string, owner: string, students: string[], teachers: string[] }[]>}
     */
    async #getCourses() {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to get courses while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");

        let q;
        if (userData.accountType == "teacher") {
            q = query(coursesRef, where("teachers", "array-contains-any", [uid]));
        } else if (userData.accountType == "student") {
            q = query(coursesRef, where("students", "array-contains-any", [uid]));
        } else {
            throw new Error("Invalid account type");
        }

        return reinterpretCast((await getDocs(q)).docs.map(e => e.data()));
    }

    /**
     * @param {string} courseCode
     * @param {string} courseName
     */
    async addCourseAsTeacher(courseCode, courseName) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to add course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");
        const document = doc(coursesRef);
        const data = {
            courseCode: courseCode,
            courseName: courseName,
            owner: uid,
            teachers: [uid],
            students: [],
        };

        await setDoc(document, data);
        this.courses.set(await this.#getCourses());
    }
}