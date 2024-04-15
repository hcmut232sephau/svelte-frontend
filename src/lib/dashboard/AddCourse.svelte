<script>
    import { Card, Button, Input } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { SideBarEntry } from './sidebar/States';

    let dispatch = createEventDispatcher();
    /**
     * @type {SideBarEntry[]}
     */
    export let courses;
    
    let newCourse = '';
</script>
<div class="flex flex-col">
    <Card class="bg-neutral-800 border-none mx-auto mt-10">
        <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course name"
                bind:value={newCourse}
            />
            <Button 
                class="ml-2"
                on:click={() => {
                    courses.push(new SideBarEntry(newCourse));
                    dispatch("onUpdateCourses", courses)
                }}
            >
                Add
            </Button>
        </div>
    </Card>
</div>

