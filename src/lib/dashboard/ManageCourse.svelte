<script>
    import { Card, Button, Input } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { SideBarEntry } from './sidebar/States';
    let dispatch = createEventDispatcher()
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
                placeholder="New course name"
                bind:value={newCourse}/>
            <Button 
            class="ml-2"
            on:click={()=>{
                courses.push(new SideBarEntry(newCourse));
                dispatch("onUpdateCourses", courses)
            }}>Add</Button>
        </div>
        {#each courses as course}
        <div class="flex my-2">
            <Card 
                class="bg-neutral-700 text-white border-none " 
                padding="sm">
                {course.title}
            </Card>
            <Button 
            class="ml-auto my-auto ml-2 p-5" 
            size="xs"
            on:click={()=>{
                courses = courses.filter((value)=>{
                    return value !== course;
                })
                dispatch("onUpdateCourses", courses);
            }}>
                <img 
                src="/trash-solid.svg" 
                class="w-4 h-4 " alt="">
            </Button>
        </div>
        {/each}
    </Card>
</div>

