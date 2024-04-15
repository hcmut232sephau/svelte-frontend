<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SideBarEntry } from "./sidebar/States";

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserData}
     */
    export let userData;
    /**
     * @type {SideBarEntry}
     */
    export let sideBarEntry;

    // TODO: extend SideBarEntry into SideBarCourseEntry, add firebase ID
    // TODO: firebase
    
    let courseCode = "UNDEF1001";
    $: courseName = sideBarEntry.title;
</script>
<div class="flex flex-col">
    <Card class="bg-neutral-800 border-none mx-auto mt-10">
        Course code
            <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course code"
                bind:value={courseCode}
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
    <Card class="bg-neutral-800 border-none mx-auto mt-10">
        Course name
            <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course name"
                bind:value={courseName}
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

