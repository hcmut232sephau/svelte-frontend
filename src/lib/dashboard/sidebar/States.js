import { CourseData } from "$lib/CourseController";

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
     * @param {CourseData} course
     */
    constructor(course) {
        super(`[${course.courseCode}] ${course.courseName}`);
        this.course = course;
    }
}