import { CourseIdentity } from "$lib/CourseController";

export class SideBarEntry {
    /**
     * @param {string} title 
     */
    constructor(title) {
        this.title = title;
    }
}

export class SideBarCourseEntry extends SideBarEntry {
    /**
     * @param {CourseIdentity} courseIdentity
     */
    constructor(courseIdentity) {
        super(`[${courseIdentity.courseCode}] ${courseIdentity.courseName}`);
        this.courseIdentity = courseIdentity;
    }
}