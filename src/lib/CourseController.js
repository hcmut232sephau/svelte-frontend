import { get, writable } from "svelte/store";
import { AuthenticationController } from "./AuthenticationController";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";

export class CourseData {
    /**
     * @param {string} id
     * @param {string} courseCode
     * @param {string} courseName
     * @param {string} teacher
     */
    constructor(id, courseCode, courseName, teacher) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.teacher = teacher;
    }
}

export class CourseState {
    /**
     * @param {CourseData} data
     * @param {boolean} joined
     */
    constructor(data, joined) {
        this.data = data;
        this.joined = joined;
    }
}

export class CourseController {
    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<CourseState[] | null>}
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
     * @returns {Promise<CourseState[]>}
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

        let firstLevelQuery = query(coursesRef);
        let firstLevel = await getDocs(firstLevelQuery);
        let courses = await Promise.all(firstLevel.docs.map(snapshot => {
            const id = snapshot.id;
            if (userData.accountType == "teacher") {
                return Promise.resolve({
                    snapshot,
                    joined: snapshot.data().teacher == uid
                });
            } else if (userData.accountType == "student") {
                let selfRef = doc(db, "courses", id, "students", uid);
                return getDoc(selfRef).then(f => {
                    return {
                        snapshot,
                        joined: f.exists()
                    };
                });
            } else {
                throw new Error("Invalid account type");
            }
        }));

        return courses.map(e => {
            const id = e.snapshot.id;
            const data = e.snapshot.data();
            const courseData = new CourseData(id, data.courseCode, data.courseName, data.teacher);
            return new CourseState(courseData, e.joined);
        });
    }

    async updateCourses() {
        return this.#getCourses().then(e => {
            this.courses.set(e);
        });
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
            teacher: uid
        };

        await setDoc(document, data);
        await this.updateCourses();
    }

    /**
     * @param {string} id 
     */
    async deleteCourseAsTeacher(id) {
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
        await this.updateCourses();
    }

    /**
     * @param {string} id
     * @param {string} courseCode
     * @param {string} courseName
     */
    async setCourseIdentity(id, courseCode, courseName) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to add course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const coursesRef = collection(db, "courses");
        const document = doc(coursesRef, id);
        const data = {
            courseCode: courseCode,
            courseName: courseName
        };

        await updateDoc(document, data);
        await this.updateCourses();
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
        const documentRef = doc(coursesRef, id, "students", uid);

        await setDoc(documentRef, {});
        await this.updateCourses();
    }

    /**
     * @param {string} id
     */
    async leaveCourseAsStudent(id) {
        const user = get(this.authCtrl.user);
        const userData = get(this.authCtrl.userData);
        if ((user === null) || (user == "loggedOut") || (userData === null)) {
            throw new Error("Trying to leave course while not logged in");
        }

        const db = this.authCtrl.firebaseCtrl.db;
        const uid = user.uid;
        const coursesRef = collection(db, "courses");
        const documentRef = doc(coursesRef, id, "students", uid);

        await deleteDoc(documentRef);
        await this.updateCourses();
    }
}