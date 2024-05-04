import { get, writable } from "svelte/store";
import { AuthenticationController, UserData } from "./AuthenticationController";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";
import { CourseData } from "./CourseController";

export class CourseSchedule {
    /**
     * @param {string} id
     * @param {string} title
     * @param {string} description
     * @param {string} link
     */
    constructor(id, title, description, link) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.link = link;
    }
}

export class CourseNote {
    /**
     * @param {string} id
     * @param {string} title
     * @param {string} description
     * @param {string} link
     */
    constructor(id, title, description, link) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.link = link;
    }
}

export class SingleCourseController {
    /**
     * Courses visible to this user.
     * @type {CourseData}
     */
    courseData;

    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<CourseSchedule[] | null>}
     */
    schedules;

    /**
     * Courses visible to this user.
     * @type {import("svelte/store").Writable<CourseNote[] | null>}
     */
    notes;

    /**
     * Students. Only present when user is viewing list of students.
     * @type {import("svelte/store").Writable<UserData[] | null>}
     */
    students;

    /**
     * @param {AuthenticationController} authCtrl
     * @param {CourseData} courseData
     */
    constructor(authCtrl, courseData) {
        this.authCtrl = authCtrl;
        this.courseData = courseData;
        this.schedules = writable(null);
        this.notes = writable(null);
        this.students = writable(null);

        this.updateSchedules();
        this.updateNotes();
    }

    /**
     * @returns {Promise<CourseSchedule[]>}
     */
    async #getSchedules() {
        const db = this.authCtrl.firebaseCtrl.db;
        const schedulesRef = collection(db, "courses", this.courseData.id, "schedules");

        let schedules = await getDocs(query(schedulesRef));
        return schedules.docs.map(e => {
            const id = e.id;
            const data = e.data();
            return new CourseSchedule(id, data.title, data.description, data.link);
        });
    }

    /**
     * @returns {Promise<CourseSchedule[]>}
     */
    async #getNotes() {
        const db = this.authCtrl.firebaseCtrl.db;
        const notesRef = collection(db, "courses", this.courseData.id, "notes");

        let notes = await getDocs(query(notesRef));
        return notes.docs.map(e => {
            const id = e.id;
            const data = e.data();
            return new CourseNote(id, data.title, data.description, data.link);
        });
    }

    async updateSchedules() {
        return this.#getSchedules().then(e => {
            this.schedules.set(e);
        });
    }

    async updateNotes() {
        return this.#getNotes().then(e => {
            this.notes.set(e);
        });
    }

    /**
     * @param {string} title
     * @param {string} description
     * @param {string} link
     */
    async addScheduleAsTeacher(title, description, link) {
        const db = this.authCtrl.firebaseCtrl.db;
        const schedulesRef = collection(db, "courses", this.courseData.id, "schedules");
        const document = doc(schedulesRef);
        const data = {
            title: title,
            description: description,
            link: link
        };

        await setDoc(document, data);
        await this.updateSchedules();
    }

    /**
     * @param {string} title
     * @param {string} description
     * @param {string} link
     */
    async addNoteAsTeacher(title, description, link) {
        const db = this.authCtrl.firebaseCtrl.db;
        const notesRef = collection(db, "courses", this.courseData.id, "notes");
        const document = doc(notesRef);
        const data = {
            title: title,
            description: description,
            link: link
        };

        await setDoc(document, data);
        await this.updateNotes();
    }

    /**
     * @param {string} id 
     */
    async deleteScheduleAsTeacher(id) {
        const db = this.authCtrl.firebaseCtrl.db;
        const schedulesRef = collection(db, "courses", this.courseData.id, "schedules");
        const document = doc(schedulesRef, id);

        await deleteDoc(document);
        await this.updateSchedules();
    }

    /**
     * @param {string} id 
     */
    async deleteNoteAsTeacher(id) {
        const db = this.authCtrl.firebaseCtrl.db;
        const notesRef = collection(db, "courses", this.courseData.id, "notes");
        const document = doc(notesRef, id);

        await deleteDoc(document);
        await this.updateNotes();
    }

    /**
     * @returns {Promise<UserData[]>}
     */
    async #getStudents() {
        const db = this.authCtrl.firebaseCtrl.db;
        const studentsRef = collection(db, "courses", this.courseData.id, "students");

        let q = query(studentsRef);
        let docs = await getDocs(q);

        return await Promise.all(docs.docs.map(d => {
            const uid = d.id;

            const usersRef = collection(db, "users");
            const userDoc = doc(usersRef, uid);
            return getDoc(userDoc).then(e => {
                let accountType = e.get("accountType") ?? "unset";
                let username = e.get("username") ?? "";
                let bio = e.get("bio") ?? "";
                let degree = e.get("degree") ?? "";
                return new UserData(accountType, username, bio, degree);
            });
        }));
    }

    async updateStudents() {
        return this.#getStudents().then(e => {
            this.students.set(e);
        });
    }

    ditchStudentCache() {
        this.students.set(null);
    }
}