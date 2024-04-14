<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import { ApplicationController } from '$lib/Controllers';
    import ManageCourse from './ManageCourse.svelte';
    import { SideBarEntry } from './sidebar/States';

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {ApplicationController}
     */
    export let appCtrl;
    /**
     * @type {"student" | "teacher"}
     */
    export let accountType;

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

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

    let manageCoursesEntry = new SideBarEntry("Manage Courses");
    let otherPages = [
        manageCoursesEntry,
    ]

    let selectedPage = calculusEntry;

    /**
     * @param {CustomEvent} event
     */
    function onSidebarSelect(event) {
        selectedPage = event.detail;
    }
</script>

<SideBar
    pageName={pageName}
    accountType={accountType}
    on:logout={onLogout}
>
    {#each otherPages as otherPage}
        <SideBarItem
            entry={otherPage}
            isSelected={otherPage == selectedPage}
            on:sidebarSelect={onSidebarSelect}
        />
    {/each}
    <li class="mb-7"></li>
    {#each courses as course}
        <SideBarItem
            entry={course}
            isSelected={course == selectedPage}
            on:sidebarSelect={onSidebarSelect}
            
        />
    {/each}
</SideBar>
<div class="ml-96">
    {#if selectedPage == manageCoursesEntry}
        <ManageCourse
            on:onUpdateCourses={
                (event)=>{
                    courses = event.detail
                }
            }
            courses={courses}
        />
    {/if}
</div>


