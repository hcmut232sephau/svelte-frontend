import { get, writable } from "svelte/store";
import { AuthenticationController } from "./AuthenticationController";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { reinterpretCast } from "./TypeTools";

export class CourseIdentity {
    /**
     * @param {string} id
     * @param {string} courseCode
     * @param {string} courseName
     */
    constructor(id, courseCode, courseName) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
    }

    /**
     * @param {string} courseCode
     * @returns {CourseIdentity}
     */
    withCode(courseCode) {
        return new CourseIdentity(this.id, courseCode, this.courseName);
    }

    /**
     * @param {string} courseName
     * @returns {CourseIdentity}
     */
    withName(courseName) {
        return new CourseIdentity(this.id, this.courseCode, courseName);
    }
};

export class CourseData {
    /**
     * @param {CourseIdentity} identity
     * @param {string} owner
     * @param {string[]} teachers
     * @param {string[]} students
     */
    constructor(identity, owner, teachers, students) {
        this.identity = identity;
        this.owner = owner;
        this.teachers = teachers;
        this.students = students;
    }
}

export class CourseController {
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

        return reinterpretCast((await getDocs(q)).docs.map(e => {
            const id = e.id;
            const data = e.data();
            const identity = new CourseIdentity(id, data.courseCode, data.courseName);
            return new CourseData(identity, data.owner, data.teachers, data.students);
        }));
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

    /**
     * @param {string} id 
     */
    async deleteCourseAsOwner(id) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to add course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");
        const document = doc(coursesRef, id);

        await deleteDoc(document);
        this.courses.set(await this.#getCourses());
    }

    /**
     * @param {CourseIdentity} id
     */
    async setCourseIdentity(id) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to add course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");
        const document = doc(coursesRef, id.id);
        const data = {
            courseCode: id.courseCode,
            courseName: id.courseName
        };

        await updateDoc(document, data);
        this.courses.set(await this.#getCourses());
    }
}