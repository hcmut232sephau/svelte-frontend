<script>
    import { Card, Button, Input } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { SideBarEntry } from './sidebar/States';

    let dispatch = createEventDispatcher();
    /**
     * @type {SideBarEntry[]}
     */
    export let courses;
    
    let courseCode = "";
    let courseName = "";
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
        </div>
        Course name
        <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course name"
                bind:value={courseName}
            />
        </div>
        <Button 
            class="flex my-2"
            on:click={() => {
                // courses.push(new SideBarEntry(newCourse));
                // dispatch("onUpdateCourses", courses)
            }}
        >
            Add
        </Button>
    </Card>
</div>

