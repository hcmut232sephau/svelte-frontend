<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController } from "$lib/CourseController";
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { SideBarCourseEntry, SideBarEntry } from './sidebar/States';
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
    $: unsubscribeUserData = authCtrl.userData.subscribe(val => {
        let refreshCourseCtrl = false;
        if ((userData === null) || (val === null) || (userData.accountType != val.accountType)) {
            refreshCourseCtrl = true;
        }
        userData = val;
        if (refreshCourseCtrl) {
            if (courseCtrl !== null) {
                courseCtrl.destroy();
            }
            if (userData === null) {
                courseCtrl = null;
            } else {
                courseCtrl = new CourseController(authCtrl);
            }
        }
    });

    /**
     * @type {SideBarCourseEntry[] | null}
     */
    let courses = null;
    $: unsubscribeCourses = courseCtrl?.courses.subscribe(val => {
        courses = val?.filter(e => e.joined).map(e => {
            return new SideBarCourseEntry(e.data);
        }) ?? null;
    }) ?? null;
    onDestroy(() => {
        if (unsubscribeCourses !== null) {
            unsubscribeCourses();
        }
        unsubscribeUserData();
        if (courseCtrl !== null) {
            courseCtrl.destroy();
        }
    });

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

    let showCourses = true;

    let courseBrowserEntry = new SideBarEntry("Browse courses");
    let courseAdderEntry = new SideBarEntry("Add course");
    let settingsEntry = new SideBarEntry("Settings");

    /**
     * @param {UserData | null} scopedUserData
     */
    function getOtherPages(scopedUserData) {
        if (scopedUserData?.accountType == "teacher") {
            return [
                courseAdderEntry,
                settingsEntry
            ];
        }
        return [
            courseBrowserEntry,
            settingsEntry
        ];
    }

    $: otherPages = getOtherPages(userData);

    /**
     * @type {SideBarEntry | null}
     */
    let selectedPage = null;

    /**
     * @param {CustomEvent} event
     */
    function onSidebarSelect(event) {
        selectedPage = event.detail;
        if (courses !== null && selectedPage !== null && typelessIncludes(courses, selectedPage)) {
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
        const result = courses?.find(e => e.course.courseCode == event.detail.courseCode);
        if (result !== undefined) {
            selectedPage = result;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onUpdateCourseIdentity(event) {
        if (courseCtrl === null) {
            return;
        }

        const entry = event.detail.entry;
        const courseCode = event.detail.courseCode;
        const courseName = event.detail.courseName;
        await courseCtrl.setCourseIdentity(entry.course.id, courseCode, courseName);
        const result = courses?.find(e => e.course.id == entry.course.id);
        if (result !== undefined) {
            selectedPage = result;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onDeleteCourse(event) {
        if (courseCtrl === null) {
            return;
        }

        const entry = event.detail.entry;
        const indexToSelectNext = courses?.findIndex(e => e.course.id == entry.course.id);
        await courseCtrl.deleteCourseAsOwner(entry.course.id);
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
            selectedPage = courses[index] ?? null;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onLeaveCourse(event) {
        if (courseCtrl === null) {
            return;
        }

        const entry = event.detail.entry;
        const indexToSelectNext = courses?.findIndex(e => e.course.id == entry.course.id);
        await courseCtrl.leaveCourseAsStudent(entry.course.id);
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
            selectedPage = courses[index] ?? null;
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
                <span class="font-bold">Courses</span>
                {#if !showCourses}
                    <AngleRightOutline class="ml-auto"/>
                {:else}
                    <AngleDownOutline class="ml-auto"/>
                {/if}
            </div>
        </SideBarSectionHeader>
        {#if courses !== null && showCourses}
            {#each courses as entry}
                <SideBarItem
                    entry={entry}
                    isSelected={entry == selectedPage}
                    on:sidebarSelect={onSidebarSelect}
                >
                    <div class="div w-5">
                        <span class="font-black text-gray-500 text-xs">{entry.course.courseCode}</span>
                    </div>
                    {entry.course.courseName}
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
    <div class="flex">
    <div class="div max-w-96 w-[30vw]"/>
    <div class="mx-auto">
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
        {:else if selectedPage == settingsEntry}
            <Settings
                authCtrl={authCtrl}
                userData={userData}
                on:logout={onLogout}
            />
        {:else if courses !== null && selectedPage !== null && typelessIncludes(courses, selectedPage)}
            <CourseView
                authCtrl={authCtrl}
                userDataCacheCtrl={userDataCacheCtrl}
                courseCtrl={courseCtrl}
                entry={reinterpretCast(selectedPage)}
                on:updateCourseIdentity={onUpdateCourseIdentity}
                on:deleteCourse={onDeleteCourse}
                on:leaveCourse={onLeaveCourse}
            />
        {/if}
    </div>
    </div>
{/if}
