<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';

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

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseData();
    });
    let courseNames = ["Linear ALgebra", "Calculus", "Chemistry"]
    let courseCodes = [1001, 1002, 1003]
    let courseIndices = [0, 1, 2]
</script>
<div class="flex flex-col w-[50vw]">
    {#each courseIndices as i}
        <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
            <div class="flex">
                <span class="mx-3 my-auto">{courseCodes[i]}</span>
                <span class="mx-2 my-auto text-white">{courseNames[i]}</span>
                <Button class="w-48 ml-auto w-24">Join</Button>
            </div>
        </Card>
    {/each}
</div>

