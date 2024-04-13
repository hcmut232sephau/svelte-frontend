<script>
    import { createEventDispatcher } from 'svelte';
    import SideBar from './ui/SideBar.svelte';
    import SideBarItem from './ui/SideBarItem.svelte';

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
<SideBar pageName={pageName}>
    {#each courses as course}
        <SideBarItem
            title={course}
            isSelected={false}
        />
    {/each}
</SideBar>
