<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { SideBarEntry } from './sidebar/States';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import ManageCourse from './AddCourse.svelte';
    import SideBarSectionHeader from './sidebar/SideBarSectionHeader.svelte';
    import Settings from './settings/Settings.svelte';
    import { AngleRightOutline, AngleDownOutline } from 'flowbite-svelte-icons'

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
                <div class="div w-5"></div>
            </SideBarItem>
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
<div class="flex">
    
    <div class="div max-w-96 w-[30vw]"/>
        <div class="mx-auto">
            {#if selectedPage == courseAdderEntry}
                <ManageCourse
                    on:onUpdateCourses={event => {
                            courses = event.detail
                    }}
                    courses={courses}
                />
            {:else if selectedPage == settingsEntry}
                <Settings
                    authCtrl={authCtrl}
                    userData={userData}
                    on:logout={onLogout}
                />
            {/if}
        </div>
</div>


