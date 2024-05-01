<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
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
    /**
     * @type {SideBarCourseEntry}
     */
    export let entry;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {UserData | null}
     */
    let userData = null;
    /**
     * @type {CourseState | null}
     */
    let courseState = null;
    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });
    const unsubscribeCourseData = courseCtrl.courses.subscribe(val => {
        courseState = val?.find(e => e.data.id == entry.course.id) ?? null;
    });

    $: isOwner = userData?.accountType == "teacher" && user !== null && user != "loggedOut" && user.uid == courseState?.data.owner;
    $: isTeacher = userData?.accountType == "teacher" && user !== null && user != "loggedOut";

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseData();
    });

    /**
     * @type {UserData | null}
     */
    let userView = null;
</script>
<div class="flex flex-col w-[50vw]">
    <CourseSettings
        entry={entry}
        isOwner={isOwner}
        isTeacher={isTeacher}
        on:updateCourseIdentity
        on:deleteCourse
        on:leaveCourse
    />
</div>

