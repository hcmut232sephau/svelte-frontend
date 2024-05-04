<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseState } from "$lib/CourseController";
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { SideBarEntry } from './sidebar/States';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import CourseBrowser from "./CourseBrowser.svelte";
    import AddCourse from './AddCourse.svelte';
    import SideBarSectionHeader from './sidebar/SideBarSectionHeader.svelte';
    import Settings from './settings/Settings.svelte';
    import CourseView from "./course/CourseView.svelte";
    import { AngleRightOutline, AngleDownOutline } from 'flowbite-svelte-icons';
    import { reinterpretCast, typelessIncludes } from "$lib/TypeTools";
    import { UserDataCacheController } from "$lib/UserDataCacheController";
    import TeacherBrowser from "./TeacherBrowser.svelte";

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;

    /**
     * @type {UserData | null}
     */
    let userData = null;
    /**
     * @type {CourseController | null}
     */
    let courseCtrl = null;
    /**
     * @type {CourseState[] | null}
     */
    let courses = null;
    /**
     * @type {import("svelte/store").Unsubscriber | null}
     */
    let unsubscribeCourses = null;
    $: unsubscribeUserData = authCtrl.userData.subscribe(val => {
        let refreshCourseCtrl = false;
        if ((userData === null) || (val === null) || (userData.accountType != val.accountType)) {
            refreshCourseCtrl = true;
        }
        userData = val;
        if (refreshCourseCtrl) {
            if (unsubscribeCourses !== null) {
                unsubscribeCourses();
            }
            if (userData === null) {
                courseCtrl = null;
            } else {
                courseCtrl = new CourseController(authCtrl);
                unsubscribeCourses = courseCtrl.courses.subscribe(val => {
                    courses = val?.filter(e => e.joined) ?? null;
                }) ?? null;
            }
        }
    });

    onDestroy(() => {
        if (unsubscribeCourses !== null) {
            unsubscribeCourses();
        }
        unsubscribeUserData();
    });

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

    let showCourses = true;

    let courseBrowserEntry = new SideBarEntry("Browse courses");
    let courseAdderEntry = new SideBarEntry("Add course");
    let teachersEntry = new SideBarEntry("Teachers");
    let settingsEntry = new SideBarEntry("Settings");

    /**
     * @param {UserData | null} scopedUserData
     */
    function getOtherPages(scopedUserData) {
        return [
            (scopedUserData?.accountType == "teacher") ? courseAdderEntry : courseBrowserEntry,
            teachersEntry,
            settingsEntry
        ];
    }

    $: otherPages = getOtherPages(userData);

    /**
     * @type {SideBarEntry | string | null}
     */
    let selectedPage = null;

    /**
     * @param {CustomEvent} event
     */
    function onSidebarSelect(event) {
        selectedPage = event.detail;
        if (courses !== null && selectedPage !== null && courses.some(e => e.data.id == selectedPage)) {
            showCourses = true;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    function onCourseShowToggle(event) {
        showCourses = !showCourses;
    }

    /**
     * @param {CustomEvent} event
     */
    async function onAddCourse(event) {
        if (courseCtrl === null) {
            return;
        }

        await courseCtrl.addCourseAsTeacher(event.detail.courseCode, event.detail.courseName);
        const result = courses?.find(e => e.data.courseCode == event.detail.courseCode);
        if (result !== undefined) {
            showCourses = true;
            selectedPage = result.data.id;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onUpdateCourseIdentity(event) {
        if (courseCtrl === null) {
            return;
        }

        const courseId = event.detail.id;
        const courseCode = event.detail.courseCode;
        const courseName = event.detail.courseName;
        await courseCtrl.setCourseIdentity(courseId, courseCode, courseName);
        const result = courses?.find(e => e.data.id == courseId);
        if (result !== undefined) {
            selectedPage = result.data.id;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onDeleteCourse(event) {
        if (courseCtrl === null) {
            return;
        }

        const id = event.detail;
        const indexToSelectNext = courses?.findIndex(e => e.data.id == id);
        await courseCtrl.deleteCourseAsTeacher(id);
        if (courses === null) {
            selectedPage = null;
        } else if ((indexToSelectNext === undefined) || (courses.length == 0)) {
            if (userData?.accountType == "student") {
                selectedPage = courseBrowserEntry;
            } else if (userData?.accountType == "teacher") {
                selectedPage = courseAdderEntry;
            }
        } else {
            const index = Math.min(indexToSelectNext, courses.length - 1);
            selectedPage = courses[index]?.data.id ?? null;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onLeaveCourse(event) {
        if (courseCtrl === null) {
            return;
        }

        const id = event.detail;
        const indexToSelectNext = courses?.findIndex(e => e.data.id == id);
        await courseCtrl.leaveCourseAsStudent(id);
        if (courses === null) {
            selectedPage = null;
        } else if ((indexToSelectNext === undefined) || (courses.length == 0)) {
            if (userData?.accountType == "student") {
                selectedPage = courseBrowserEntry;
            } else if (userData?.accountType == "teacher") {
                selectedPage = courseAdderEntry;
            }
        } else {
            const index = Math.min(indexToSelectNext, courses.length - 1);
            selectedPage = courses[index]?.data.id ?? null;
        }
    }
</script>

{#if userData !== null && courseCtrl !== null}
    <SideBar
        pageName={pageName}
        userData={userData}
    >
        <SideBarSectionHeader on:click={onCourseShowToggle}>
            <div class="div flex">
                <span class="font-bold">
                    {#if courses === null}
                        Loading courses...
                    {:else}
                        Courses
                    {/if}
                </span>
                {#if courses !== null}
                    {#if !showCourses}
                        <AngleRightOutline class="ml-auto"/>
                    {:else}
                        <AngleDownOutline class="ml-auto"/>
                    {/if}
                {/if}
            </div>
        </SideBarSectionHeader>
        {#if courses !== null && showCourses}
            {#each courses as course}
                <SideBarItem
                    entry={course.data.id}
                    isSelected={course.data.id == selectedPage}
                    on:sidebarSelect={onSidebarSelect}
                >
                    <div class="div w-5">
                        <span class="font-black text-gray-500 text-xs">{course.data.courseCode}</span>
                    </div>
                    {course.data.courseName}
                </SideBarItem>
            {/each}
        {/if}
        <li class="mb-7"></li>
        {#each otherPages as otherPage}
            <SideBarItem
                entry={otherPage}
                isSelected={otherPage == selectedPage}
                on:sidebarSelect={onSidebarSelect}
            >
                <span class="font-bold">{otherPage.title}</span>
            </SideBarItem>
        {/each}
    </SideBar>
    <div class="flex bg-neutral-900 h-screen">
        <div class="div max-w-96 h-full w-[30vw]"/>
        <div class="w-full overflow-auto">
            <div class="flex flex-col w-[50vw] mb-8 mx-auto">
                {#if selectedPage == courseBrowserEntry}
                    <CourseBrowser
                        authCtrl={authCtrl}
                        userDataCacheCtrl={userDataCacheCtrl}
                        courseCtrl={courseCtrl}
                    />
                {:else if selectedPage == courseAdderEntry}
                    <AddCourse
                        on:addCourse={onAddCourse}
                    />
                {:else if selectedPage == teachersEntry}
                    <TeacherBrowser
                        authCtrl={authCtrl}
                        userDataCacheCtrl={userDataCacheCtrl}
                        on:logout={onLogout}
                    />
                {:else if selectedPage == settingsEntry}
                    <Settings
                        authCtrl={authCtrl}
                        userData={userData}
                        on:logout={onLogout}
                    />
                {:else if courses !== null && selectedPage !== null && courses.some(e => e.data.id == selectedPage)}
                    <CourseView
                        authCtrl={authCtrl}
                        userDataCacheCtrl={userDataCacheCtrl}
                        courseCtrl={courseCtrl}
                        courseId={reinterpretCast(selectedPage)}
                        on:updateCourseIdentity={onUpdateCourseIdentity}
                        on:deleteCourse={onDeleteCourse}
                        on:leaveCourse={onLeaveCourse}
                    />
                {/if}
            </div>
        </div>
        
    </div>
{/if}
