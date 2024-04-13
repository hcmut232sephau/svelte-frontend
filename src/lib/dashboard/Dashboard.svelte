<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './sidebar/SideBar.svelte';
    import SideBarItem from './sidebar/SideBarItem.svelte';

    /**
     * @type {String}
     */
    export let pageName;

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
    ]

    let selectedCourse = "Calculus";
</script>
<SideBar
    pageName={pageName}
    on:logout={onLogout}
>
    {#each courses as course}
        <SideBarItem
            title={course}
            isSelected={false}
        />
    {/each}
</SideBar>
