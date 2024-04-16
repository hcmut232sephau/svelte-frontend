<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController } from "$lib/CourseController";
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { SideBarCourseEntry, SideBarEntry } from './sidebar/States';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
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
        if (val === null) {
            courses = null;
        } else {
            courses = val.map(e => {
                return new SideBarCourseEntry(e.identity);
            });
        }
    });
    onDestroy(() => {
        unsubscribeCourses();
        courseCtrl.destroy();
    });

    let courseAdderEntry = new SideBarEntry("Add course");
    let settingsEntry = new SideBarEntry("Settings");
    let otherPages = [
        courseAdderEntry,
        settingsEntry
    ];

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
        {:else if courses !== null && selectedPage !== null && typelessIncludes(courses, selectedPage)}
            <CourseView
                courseCtrl={courseCtrl}
                entry={reinterpretCast(selectedPage)}
            />
        {/if}
    </div>
</div>
