<script>
    import { CourseController } from "$lib/CourseController";
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
    export let isOwner;
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
    <Card class="bg-neutral-800 border-none mx-auto mt-10" size="lg">
        Course code
            <div class="flex my-2">
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
        Course name
        <div class="flex my-2">
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
            class="my-2"
            on:click={onUpdateCourseIdentity}
        >
            Save
        </Button>
    </Card>
{/if}
{#if isOwner}
    <Card class="bg-neutral-800 border-none mx-auto mt-10" size="lg">
        <Button 
            class="my-2 bg-red-800"
            on:click={onDeleteCourse}
        >
            Delete course
        </Button>
    </Card>
{:else}
    <Card class="bg-neutral-800 border-none mx-auto mt-10" size="lg">
        <Button 
            class="my-2 bg-red-800"
            on:click={onLeaveCourse}
        >
            Leave course
        </Button>
    </Card>
{/if}