<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SideBarCourseEntry } from "./sidebar/States";

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserData}
     */
    export let userData;
    /**
     * @type {SideBarCourseEntry}
     */
    export let entry;

    // TODO: extend SideBarEntry into SideBarCourseEntry, add firebase ID
    // TODO: firebase
    
    $: courseCode = entry.courseCode;
    $: courseName = entry.courseName;
</script>
<div class="flex flex-col">
    <Card class="bg-neutral-800 border-none mx-auto mt-10">
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
            <Button 
                class="ml-2"
                on:click={() => {
                    // TODO: firebase
                }}
            >
                Save
            </Button>
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
            <Button 
                class="ml-2"
                on:click={() => {
                    // TODO: firebase
                }}
            >
                Save
            </Button>
        </div>
    </Card>
</div>

