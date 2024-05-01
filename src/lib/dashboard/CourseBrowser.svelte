<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import CourseMetadata from "./browsing/CourseMetadata.svelte";
    import { UserDataCacheController } from "$lib/UserDataCacheController";

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;
    /**
     * @type {CourseController}
     */
    export let courseCtrl;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {CourseState[] | null}
     */
    let courses = null;
    let unsubscribeUserData = authCtrl.user.subscribe(val => {
        user = val;
    });
    let unsubscribeCourses = courseCtrl.courses.subscribe(val => {
        courses = val;
    });
    onDestroy(() => {
        unsubscribeUserData();
        unsubscribeCourses();
    });

</script>
<div class="flex flex-col w-[50vw]">
    {#each (courses ?? []).filter(e => !e.joined) as course}
        <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
            <div class="font-black text-gray-500 text-xs">{course.data.courseCode}</div>
            <div class="flex">
                <span class="my-auto text-white">{course.data.courseName}</span>
                {#if user === null || user == "loggedOut"}
                    Loading...
                {:else}
                    <Button class="ml-auto w-24" on:click={() => {
                        courseCtrl.joinCourseAsStudent(course.data.id);
                    }}>Join</Button>
                {/if}
            </div>
            <CourseMetadata userDataCacheCtrl={userDataCacheCtrl} course={course.data}/>
        </Card>
    {/each}
</div>

