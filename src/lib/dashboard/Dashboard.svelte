<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import { ApplicationController, UserData } from '$lib/Controllers';
    import ManageCourse from './AddCourse.svelte';
    import { SideBarEntry } from './sidebar/States';
    import SideBarSectionHeader from './sidebar/SideBarSectionHeader.svelte';
    import Settings from './settings/Settings.svelte';

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {ApplicationController}
     */
    export let appCtrl;
    /**
     * @type {UserData}
     */
    export let userData;

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

    let showCourses = true;

    let calculusEntry = new SideBarEntry("Calculus");
    let courses = [
        calculusEntry,
        new SideBarEntry("Linear Algebra"),
        new SideBarEntry("Operating System"),
        new SideBarEntry("Advanced Programing"),
        new SideBarEntry("Computer Architecture"),
        new SideBarEntry("Chemistry"),
        new SideBarEntry("Physics")
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
        Courses
    </SideBarSectionHeader>
    {#if showCourses}
        {#each courses as course}
            <SideBarItem
                entry={course}
                isSelected={course == selectedPage}
                on:sidebarSelect={onSidebarSelect}
            />
        {/each}
    {/if}
    <li class="mb-7"></li>
    {#each otherPages as otherPage}
        <SideBarItem
            entry={otherPage}
            isSelected={otherPage == selectedPage}
            on:sidebarSelect={onSidebarSelect}
        />
    {/each}
</SideBar>
<div class="ml-96">
    {#if selectedPage == courseAdderEntry}
        <ManageCourse
            on:onUpdateCourses={event => {
                    courses = event.detail
            }}
            courses={courses}
        />
    {:else if selectedPage == settingsEntry}
        <Settings
            appCtrl={appCtrl}
            userData={userData}
            on:logout={onLogout}
        />
    {/if}
</div>


