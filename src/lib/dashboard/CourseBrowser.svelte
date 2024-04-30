<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData } from "$lib/CourseController";
    import { CourseBrowseController } from "$lib/CourseBrowseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';

    let dispatch = createEventDispatcher();

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {UserData | null}
     */
    let userData = null;
    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });

    /**
     * @type {CourseBrowseController | null}
     */
    let courseBrowseCtrl = null;
    $: unsubscribeUserData = authCtrl.userData.subscribe(val => {
        let refreshCourseCtrl = false;
        if ((userData === null) || (val === null) || (userData.accountType != val.accountType)) {
            refreshCourseCtrl = true;
        }
        userData = val;
        if (refreshCourseCtrl) {
            if (courseBrowseCtrl !== null) {
                courseBrowseCtrl.destroy();
            }
            if (userData === null) {
                courseBrowseCtrl = null;
            } else {
                courseBrowseCtrl = new CourseBrowseController(authCtrl);
            }
        }
    });

    /**
     * @type {CourseData[] | null}
     */
    let courses = null;
    $: unsubscribeCourses = courseBrowseCtrl?.courses.subscribe(val => {
        courses = val ?? null;
    }) ?? null;
    onDestroy(() => {
        if (unsubscribeCourses !== null) {
            unsubscribeCourses();
        }
        unsubscribeUserData();
        if (courseBrowseCtrl !== null) {
            courseBrowseCtrl.destroy();
        }
    });

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
    });
</script>
<div class="flex flex-col w-[50vw]">
    {#each courses ?? [] as course}
        <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
            <div class="flex">
                <span class="mx-3 my-auto">{course.identity.courseCode}</span>
                <span class="mx-2 my-auto text-white">{course.identity.courseName}</span>
                <Button class="w-48 ml-auto w-24">Join</Button>
            </div>
        </Card>
    {/each}
</div>

