import { AuthenticationController } from "./AuthenticationController";

export class CourseController {
    /**
     * @param {AuthenticationController} authCtrl
     */
    constructor(authCtrl) {
        console.log("creating new course controller");
        this.authCtrl = authCtrl;
    }

    /**
     * @param {string} courseCode
     * @param {string} courseName
     */
    async addCourse(courseCode, courseName) {
        console.log("adding course ", courseCode, courseName);
    }
}