<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { SideBarCourseEntry, SideBarEntry } from './sidebar/States';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import AddCourse from './AddCourse.svelte';
    import SideBarSectionHeader from './sidebar/SideBarSectionHeader.svelte';
    import Settings from './settings/Settings.svelte';
    import CourseView from "./CourseView.svelte";
    import { AngleRightOutline, AngleDownOutline } from 'flowbite-svelte-icons';

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

    let calculusEntry = new SideBarCourseEntry("MT1010", "Calculus");
    let courses = [
        calculusEntry,
        new SideBarCourseEntry("MT2010", "Linear Algebra"),
        new SideBarCourseEntry("CS2010", "Operating System"),
        new SideBarCourseEntry("CS2011", "Advanced Programing"),
        new SideBarCourseEntry("CS2012", "Computer Architecture"),
        new SideBarCourseEntry("CH1010", "Chemistry"),
        new SideBarCourseEntry("PH1010", "Physics")
    ];

    let courseAdderEntry = new SideBarEntry("Add course");
    let settingsEntry = new SideBarEntry("Settings");
    let otherPages = [
        courseAdderEntry,
        settingsEntry
    ];

    let selectedPage = calculusEntry;

    /**
     * @param {CustomEvent} event
     */
    function onSidebarSelect(event) {
        selectedPage = event.detail;
        if (courses.includes(selectedPage)) {
            showCourses = true;
        }
    }

    /**
     * @param {CustomEvent} event
     */
    function onCourseShowToggle(event) {
        showCourses = !showCourses;
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
    {#if showCourses}
        {#each courses as course}
            <SideBarItem
                entry={course}
                isSelected={course == selectedPage}
                on:sidebarSelect={onSidebarSelect}
            >
                <div class="div w-5">
                    <span class="font-black text-gray-500 text-xs">{course.courseCode}</span>
                </div>
                {course.courseName}
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
        {#if selectedPage == courseAdderEntry}
            <AddCourse
                courseCtrl={courseCtrl}
            />
        {:else if selectedPage == settingsEntry}
            <Settings
                authCtrl={authCtrl}
                userData={userData}
                on:logout={onLogout}
            />
        {:else if courses.includes(selectedPage)}
            <CourseView
                authCtrl={authCtrl}
                userData={userData}
                entry={selectedPage}
            />
        {/if}
    </div>
</div>
