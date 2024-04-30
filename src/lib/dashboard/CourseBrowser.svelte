<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData } from "$lib/CourseController";
    import { CourseBrowseController } from "$lib/CourseBrowseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import CourseMetadata from "./browsing/CourseMetadata.svelte";

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {CourseController}
     */
    export let courseCtrl;

    let courseBrowseCtrl = new CourseBrowseController(authCtrl, courseCtrl);

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {CourseData[] | null}
     */
    let courses = null;
    let unsubscribeUserData = authCtrl.user.subscribe(val => {
        user = val;
    })
    $: unsubscribeCourses = courseBrowseCtrl?.courses.subscribe(val => {
        courses = val ?? null;
    }) ?? null;
    onDestroy(() => {
        unsubscribeUserData();
        if (unsubscribeCourses !== null) {
            unsubscribeCourses();
        }
        if (courseBrowseCtrl !== null) {
            courseBrowseCtrl.destroy();
        }
    });
    
</script>
<div class="flex flex-col w-[50vw]">
    {#each courses ?? [] as course}
        <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
            <div class="font-black text-gray-500 text-xs">{course.identity.courseCode}</div>
            <div class="flex">
                <span class="my-auto text-white">{course.identity.courseName}</span>
                {#if user === null || user == "loggedOut"}
                    Loading...
                {:else if course.students.includes(user.uid)}
                    <Button disabled class="ml-auto w-24">Joined</Button>
                {:else}
                    <Button class="ml-auto w-24" on:click={() => {
                        courseBrowseCtrl.joinCourseAsStudent(course.identity.id);
                    }}>Join</Button>
                {/if}
            </div>
            <CourseMetadata authCtrl={authCtrl} course={course}/>
        </Card>
    {/each}
</div>

