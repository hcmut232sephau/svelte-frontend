<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SideBarCourseEntry } from "./sidebar/States";
    import CourseSettings from "./CourseSettings.svelte";

    let dispatch = createEventDispatcher();

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {CourseController}
     */
    export let courseCtrl;
    // /**
    //  * @type {SideBarCourseEntry}
    //  */
    // export let entry;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {UserData | null}
     */
    let userData;
    /**
     * @type {CourseData[] | null}
     */
    let courseData = null;
    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });
    const unsubscribeCourseData = courseCtrl.courses.subscribe(val => {
        courseData = val;
    });

    // $: isOwner = userData?.accountType == "teacher" && user !== null && user != "loggedOut" && user.uid == courseData?.owner;
    // $: isAuthenticatedTeacher = userData?.accountType == "teacher" && user !== null && user != "loggedOut" && (courseData?.teachers.includes(user.uid) ?? false);

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseData();
    });
</script>
<div class="flex flex-col w-[50vw]">
    <!-- {#if isAuthenticatedTeacher || isOwner}
        <CourseSettings
            entry={entry}
            isOwner={isOwner}
            isAuthenticatedTeacher={isAuthenticatedTeacher}
            on:updateCourseIdentity
            on:deleteCourse
        />
    {/if} -->
</div>

