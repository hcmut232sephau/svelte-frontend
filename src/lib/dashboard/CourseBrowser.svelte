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
    let joinedCourses = [];
    /**
     * @type {CourseData[] | null}
     */
    let allCourses = null;
    let unsubscribeUserData = authCtrl.user.subscribe(val => {
        user = val;
    });
    let unsubscribeJoinedCourses = courseCtrl.courses.subscribe(val => {
        joinedCourses = val;
    });
    $: unsubscribeAllCourses = courseBrowseCtrl?.courses.subscribe(val => {
        allCourses = val;
    }) ?? null;
    onDestroy(() => {
        unsubscribeUserData();
        unsubscribeJoinedCourses();
        if (unsubscribeAllCourses !== null) {
            unsubscribeAllCourses();
        }
        if (courseBrowseCtrl !== null) {
            courseBrowseCtrl.destroy();
        }
    });

</script>
<div class="flex flex-col w-[50vw]">
    {#each allCourses ?? [] as course}
        <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
            <div class="font-black text-gray-500 text-xs">{course.courseCode}</div>
            <div class="flex">
                <span class="my-auto text-white">{course.courseName}</span>
                {#if user === null || user == "loggedOut"}
                    Loading...
                {:else if course.id}
                    <Button disabled class="ml-auto w-24">Joined</Button>
                {:else}
                    <Button class="ml-auto w-24" on:click={() => {
                        courseBrowseCtrl.joinCourseAsStudent(course.id);
                    }}>Join</Button>
                {/if}
            </div>
            <CourseMetadata authCtrl={authCtrl} course={course}/>
        </Card>
    {/each}
</div>

