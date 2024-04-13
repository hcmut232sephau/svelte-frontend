<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import { ApplicationController } from '$lib/Controllers';
    import ManageCourse from './ManageCourse.svelte';

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

    let courses = [
        "Calculus",
        "Linear Algebra",
        "Operating System",
        "Advanced Programing",
        "Computer Architecture",
        "Chemistry",
        "Physics"
    ];
    let otherPages = [
        "Manage Courses",
    ]

    let selectedPage = "Calculus";

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
            title={otherPage}
            isSelected={otherPage == selectedPage}
            on:sidebar-select={onSidebarSelect}
        />
    {/each}
    <li class="mb-7"></li>
    {#each courses as course}
        <SideBarItem
            title={course}
            isSelected={course == selectedPage}
            on:sidebar-select={onSidebarSelect}
            
        />
    {/each}
</SideBar>
<div class="ml-96">
    {#if selectedPage == "Manage Courses"}
        <ManageCourse
        on:onUpdateCourses={
            (event)=>{
                courses = event.detail
            }
        }
        courses = {courses}/>
    {/if}
</div>


