<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';
    import { ApplicationController } from '$lib/Controllers';

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

    let selectedCourse = "Calculus";

    /**
     * @param {CustomEvent} event
     */
    function onSidebarSelect(event) {
        selectedCourse = event.detail;
    }
</script>
<SideBar
    pageName={pageName}
    accountType={accountType}
    on:logout={onLogout}
>
    {#each courses as course}
        <SideBarItem
            title={course}
            isSelected={course == selectedCourse}
            on:sidebar-select={onSidebarSelect}
        />
    {/each}
</SideBar>
