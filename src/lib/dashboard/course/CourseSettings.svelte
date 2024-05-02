<script>
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SideBarCourseEntry } from "$lib/dashboard/sidebar/States";

    let dispatch = createEventDispatcher();

    /**
     * @type {SideBarCourseEntry}
     */
    export let entry;
    /**
     * @type {boolean}
     */
    export let isTeacher;
    
    $: courseCode = entry.course.courseCode;
    $: courseName = entry.course.courseName;

    function onUpdateCourseIdentity() {
        dispatch("updateCourseIdentity", {entry, courseCode, courseName});
    }

    function onDeleteCourse() {
        dispatch("deleteCourse", {entry});
    }

    function onLeaveCourse() {
        dispatch("leaveCourse", {entry});
    }
</script>
{#if isTeacher}
    <Card class="bg-neutral-800 border-none mx-auto" size="lg">
        <h1 class="text-white text-lg font-bold">
            Course settings
        </h1>
        <div class="flex mt-2">Course code</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course code"
                value={courseCode}
                on:input={e => {
                    if (e.target != null) {
                        // @ts-ignore
                        courseCode = e.target.value;
                    }
                }}
            />
        </div>
        <div class="mt-2">Course name</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course name"
                value={courseName}
                on:input={e => {
                    if (e.target != null) {
                        // @ts-ignore
                        courseName = e.target.value;
                    }
                }}
            />
        </div>
        <Button 
            class="mt-4"
            on:click={onUpdateCourseIdentity}
        >
            Save
        </Button>
    </Card>
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <h1 class="text-white text-lg font-bold">
            Course management
        </h1>
        <Button class="mt-4 bg-red-800" on:click={onDeleteCourse}>
            Delete course
        </Button>
    </Card>
{:else}
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <Button class="bg-red-800" on:click={onLeaveCourse}>
            Leave course
        </Button>
    </Card>
{/if}