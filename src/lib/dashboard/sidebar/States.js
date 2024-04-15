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
     * @param {string} courseCode
     * @param {string} courseName
     */
    constructor(courseCode, courseName) {
        super(`[${courseCode}] ${courseName}`);
        this.courseCode = courseCode;
        this.courseName = courseName;
    }
}