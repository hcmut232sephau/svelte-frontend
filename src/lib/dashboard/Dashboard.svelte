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
    import CourseView from "./CourseView.svelte";
    import { AngleRightOutline, AngleDownOutline } from 'flowbite-svelte-icons';
    import { reinterpretCast, typelessIncludes } from "$lib/TypeTools";

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserData}
     */
    export let userData;

    $: courseCtrl = new CourseController(authCtrl);

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

    let showCourses = true;

    /**
     * @type {SideBarCourseEntry[] | null}
     */
    let courses = null;
    $: unsubscribeCourses = courseCtrl.courses.subscribe(val => {
        courses = val?.map(e => {
            return new SideBarCourseEntry(e.identity);
        }) ?? null;
    });
    onDestroy(() => {
        unsubscribeCourses();
        courseCtrl.destroy();
    });

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
        await courseCtrl.addCourseAsTeacher(event.detail.courseCode, event.detail.courseName);
        const result = courses?.find(e => e.courseIdentity.courseCode == event.detail.courseCode);
        if (result !== undefined) {
            selectedPage = result;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    async function onUpdateCourseIdentity(event) {
        const entry = event.detail.entry;
        const courseCode = event.detail.courseCode;
        const courseName = event.detail.courseName;
        await courseCtrl.setCourseIdentity(entry.courseIdentity.withCode(courseCode).withName(courseName));
        const result = courses?.find(e => e.courseIdentity.id == entry.courseIdentity.id);
        if (result !== undefined) {
            selectedPage = result;
        }
    }
</script>

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
                    <span class="font-black text-gray-500 text-xs">{entry.courseIdentity.courseCode}</span>
                </div>
                {entry.courseIdentity.courseName}
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
                courseCtrl={courseCtrl}
                entry={reinterpretCast(selectedPage)}
                on:updateCourseIdentity={onUpdateCourseIdentity}
            />
        {/if}
    </div>
</div>
