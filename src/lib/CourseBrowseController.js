import { get, writable } from "svelte/store";
import { AuthenticationController } from "./AuthenticationController";
import { CourseIdentity, CourseData } from "./CourseController";
import { arrayUnion, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { reinterpretCast } from "./TypeTools";

export class CourseBrowseController {
    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<CourseData[] | null>}
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
     * @returns {Promise<CourseData[]>}
     */
    async #getCourses() {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to browse courses while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const coursesRef = collection(db, "courses");

        let q = query(coursesRef);

        return reinterpretCast((await getDocs(q)).docs.map(e => {
            const id = e.id;
            const data = e.data();
            const identity = new CourseIdentity(id, data.courseCode, data.courseName);
            return new CourseData(identity, data.owner, data.teachers, data.students);
        }));
    }

    /**
     * @param {string} id
     */
    async joinCourseAsStudent(id) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to join course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");
        const document = doc(coursesRef, id);

        await updateDoc(document, { students: arrayUnion(uid) });
        this.courses.set(await this.#getCourses());
    }
}